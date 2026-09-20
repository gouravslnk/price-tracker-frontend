import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { useTrackedProducts, useUntrackProduct, useManualScrape, useRefreshAllProducts } from '../hooks/useProducts.js';
import { ProductCard } from '../components/products/ProductCard.jsx';
import { ProductTable } from '../components/products/ProductTable.jsx';
import { ProductFilters } from '../components/products/ProductFilters.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { CardSkeleton } from '../components/common/Skeleton.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { EmptyState } from '../components/common/EmptyState.jsx';
import { Button } from '../components/common/Button.jsx';
import { calculatePriceChange, formatCurrency, getFilterLabel } from '../utils/formatters.js';
import { toast } from 'sonner';

export const Products = () => {
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-ine-800 pb-6">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            INE CATALOG REPOSITORY
          </div>
          <h1 className="font-serif font-bold text-3xl text-neutral-950 dark:text-white mt-1">
            Tracked Products Directory
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefreshAll}
            isLoading={refreshAllMutation.isPending}
            title="Refresh prices across all tracked products"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${refreshAllMutation.isPending ? 'animate-spin' : ''}`} />
            <span>Refresh All</span>
          </Button>

          <Link to="/products/add">
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Track New Product</span>
            </Button>
          </Link>
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

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <ErrorState
          title="Unable to fetch tracked products"
          message={error?.message || 'Server error occurred.'}
          onRetry={refetch}
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title={products.length === 0 ? 'No products tracked' : 'No matching results'}
          description={
            products.length === 0
              ? 'Start adding items from the INE Store to build your price tracker directory.'
              : searchQuery
              ? `No tracked products match "${searchQuery}".`
              : `No tracked products found under the "${getFilterLabel(selectedFilter)}" filter.`
          }
          action={
            products.length === 0 ? (
              <Link to="/products/add">
                <Button variant="primary">
                  <Plus className="w-4 h-4 mr-1.5" />
                  <span>Add Product</span>
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedFilter('ALL'); }}>
                Clear Search
              </Button>
            )
          }
        />
      ) : viewMode === 'table' ? (
        <ProductTable
          products={filteredProducts}
          onRemove={setProductToRemove}
          onRefresh={handleManualRefresh}
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
