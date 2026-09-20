import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, TrendingDown, TrendingUp, PackageCheck, PackageX, RefreshCw, Layers } from 'lucide-react';
import { useTrackedProducts, useManualScrape, useRefreshAllProducts, useUntrackProduct } from '../hooks/useProducts.js';
import { ProductCard } from '../components/products/ProductCard.jsx';
import { ProductFilters } from '../components/products/ProductFilters.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { CardSkeleton } from '../components/common/Skeleton.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { calculatePriceChange, formatCurrency, formatRelativeTime, getFilterLabel } from '../utils/formatters.js';
import { Button } from '../components/common/Button.jsx';
import { toast } from 'sonner';

export const Dashboard = () => {
  const { data: products = [], isLoading, isError, error, refetch } = useTrackedProducts();
  const untrackMutation = useUntrackProduct();
  const refreshMutation = useManualScrape();
  const refreshAllMutation = useRefreshAllProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('RECENTLY_UPDATED');
  const [viewMode, setViewMode] = useState('grid');
  const [productToRemove, setProductToRemove] = useState(null);
  const [refreshingProductId, setRefreshingProductId] = useState(null);

  // Compute summary metrics dynamically
  const metrics = useMemo(() => {
    let drops = 0;
    let increases = 0;
    let outOfStock = 0;
    let inStock = 0;
    let failedScrapes = 0;

    products.forEach(p => {
      const change = calculatePriceChange(p.current_price, p.baseline_price);
      if (change?.direction === 'DROP') drops++;
      if (change?.direction === 'INCREASE') increases++;

      if (p.latest_scrape_status === 'FAILED') {
        failedScrapes++;
      } else if (p.current_stock === 0) {
        outOfStock++;
      } else if (p.current_stock > 0) {
        inStock++;
      }
    });

    return {
      total: products.length,
      drops,
      increases,
      outOfStock,
      inStock,
      failedScrapes
    };
  }, [products]);

  // Filter & Sort products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Search term filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesSku = p.sku?.toLowerCase().includes(q);
        const matchesStoreId = String(p.store_product_id).includes(q);
        if (!matchesName && !matchesSku && !matchesStoreId) return false;
      }

      // Filter tabs
      if (selectedFilter === 'IN_STOCK') return p.current_stock > 0 && p.latest_scrape_status !== 'FAILED';
      if (selectedFilter === 'OUT_OF_STOCK') return p.current_stock === 0 && p.latest_scrape_status !== 'FAILED';
      if (selectedFilter === 'FAILED_SCRAPE') return p.latest_scrape_status === 'FAILED';

      const change = calculatePriceChange(p.current_price, p.baseline_price);
      if (selectedFilter === 'PRICE_DROP') return change?.direction === 'DROP';
      if (selectedFilter === 'PRICE_INCREASE') return change?.direction === 'INCREASE';

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'PRICE_LOW') return (a.current_price || 0) - (b.current_price || 0);
      if (selectedSort === 'PRICE_HIGH') return (b.current_price || 0) - (a.current_price || 0);
      if (selectedSort === 'NAME') return (a.name || '').localeCompare(b.name || '');
      // RECENTLY_UPDATED
      return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
    });
  }, [products, searchQuery, selectedFilter, selectedSort]);

  const handleConfirmRemove = async () => {
    if (!productToRemove) return;
    try {
      await untrackMutation.mutateAsync(productToRemove.id);
      toast.success(`Stopped tracking "${productToRemove.name}"`);
      setProductToRemove(null);
    } catch (err) {
      toast.error(`Unable to remove product: ${err.message}`);
    }
  };

  const handleManualRefresh = async (product) => {
    setRefreshingProductId(product.id);
    try {
      const res = await refreshMutation.mutateAsync(product.id);
      if (res.success) {
        toast.success(`Price updated: ${formatCurrency(res.price, res.currency)}`);
      } else {
        toast.error('Scrape check failed. Displaying last successful price.');
      }
    } catch (err) {
      toast.error(`Scrape failed: ${err.message}`);
    } finally {
      setRefreshingProductId(null);
    }
  };

  const handleRefreshAll = async () => {
    try {
      const res = await refreshAllMutation.mutateAsync();
      toast.success(res?.message || 'Batch scrape initiated for all tracked products.');
    } catch (err) {
      const msg = err.response?.data?.error?.message || err.message || 'Failed to trigger batch refresh';
      toast.error(`Refresh all error: ${msg}`);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* 1. Hero Section */}
      <section className="p-8 border border-neutral-200 dark:border-ine-800 bg-white dark:bg-ine-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            INE PRICE MONITOR &middot; LIVE TRACKING
          </div>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-neutral-950 dark:text-white leading-tight">
            Track prices. Know when they move.
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
            Automated monitoring and price history analysis for the INE Store. Track price drops, stock changes, and availability observations in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            size="lg"
            variant="outline"
            onClick={handleRefreshAll}
            isLoading={refreshAllMutation.isPending}
            title="Refresh prices across all tracked products"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshAllMutation.isPending ? 'animate-spin' : ''}`} />
            <span>Refresh All</span>
          </Button>
          <Link to="/products/add">
            <Button size="lg" variant="primary">
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Button>
          </Link>
          <Link to="/products">
            <Button size="lg" variant="outline">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. Metrics Summary Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Tracked Products */}
        <div className="p-5 bg-white dark:bg-ine-900 border border-neutral-200 dark:border-ine-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400">
            <span>TRACKED PRODUCTS</span>
            <Layers className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-950 dark:text-white">
            {isLoading ? '—' : metrics.total}
          </div>
          <div className="text-xs font-mono text-neutral-500">
            Active in catalog
          </div>
        </div>

        {/* Price Drops */}
        <div className="p-5 bg-white dark:bg-ine-900 border border-neutral-200 dark:border-ine-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <span>PRICE DROPS</span>
            <TrendingDown className="w-4 h-4" />
          </div>
          <div className="text-3xl font-serif font-bold text-emerald-700 dark:text-emerald-400">
            {isLoading ? '—' : metrics.drops}
          </div>
          <div className="text-xs font-mono text-neutral-500">
            Discounted vs prior check
          </div>
        </div>

        {/* Price Increases */}
        <div className="p-5 bg-white dark:bg-ine-900 border border-neutral-200 dark:border-ine-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <span>PRICE INCREASES</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-3xl font-serif font-bold text-rose-700 dark:text-rose-400">
            {isLoading ? '—' : metrics.increases}
          </div>
          <div className="text-xs font-mono text-neutral-500">
            Increased vs prior check
          </div>
        </div>

        {/* Out of Stock */}
        <div className="p-5 bg-white dark:bg-ine-900 border border-neutral-200 dark:border-ine-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400">
            <span>OUT OF STOCK</span>
            <PackageX className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="text-3xl font-serif font-bold text-neutral-950 dark:text-white">
            {isLoading ? '—' : metrics.outOfStock}
          </div>
          <div className="text-xs font-mono text-neutral-500">
            Stock = 0 observations
          </div>
        </div>
      </section>



      {/* 4. Main Tracked Products Section */}
      <section className="space-y-6 pt-4">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-ine-800 pb-4">
          <div>
            <h2 className="font-serif font-bold text-2xl text-neutral-950 dark:text-white">
              Tracked Products
            </h2>
            <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-1">
              Active product price tracker registry
            </p>
          </div>
        </div>

        {/* Filters bar */}
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={filteredProducts.length}
        />

        {/* Content States */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : isError ? (
          <ErrorState
            title="Failed to load tracked products"
            message={error?.message || 'Unable to connect to the price tracker backend.'}
            onRetry={refetch}
          />
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title={products.length === 0 ? 'No products tracked yet' : 'No matching products found'}
            description={
              products.length === 0
                ? 'Start tracking items from the INE Store to monitor live prices, stock levels, and historical trends.'
                : searchQuery
                ? `No tracked products match "${searchQuery}".`
                : `No tracked products found under the "${getFilterLabel(selectedFilter)}" filter.`
            }
            action={
              products.length === 0 ? (
                <Link to="/products/add">
                  <Button variant="primary">
                    <Plus className="w-4 h-4 mr-1.5" />
                    <span>Track Your First Product</span>
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedFilter('ALL'); }}>
                  Clear Filters
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onRemove={setProductToRemove}
                onRefresh={handleManualRefresh}
                isRefreshing={refreshingProductId === product.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Untrack confirmation modal */}
      <ConfirmDialog
        isOpen={Boolean(productToRemove)}
        onClose={() => setProductToRemove(null)}
        onConfirm={handleConfirmRemove}
        title="Stop tracking product?"
        description={`Are you sure you want to stop tracking "${productToRemove?.name}"? Historical observations will remain stored.`}
        confirmText="Remove Product"
        isLoading={untrackMutation.isPending}
      />
    </div>
  );
};
