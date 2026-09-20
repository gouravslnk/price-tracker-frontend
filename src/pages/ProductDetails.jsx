import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trash2, ExternalLink, Package, ArrowDownRight, ArrowUpRight, Minus, AlertCircle } from 'lucide-react';
import { useTrackedProducts, usePriceHistory, useScrapeLogs, useManualScrape, useUntrackProduct } from '../hooks/useProducts.js';
import { PriceChart } from '../components/product-detail/PriceChart.jsx';
import { PriceStatistics } from '../components/product-detail/PriceStatistics.jsx';
import { ScrapeActivity } from '../components/product-detail/ScrapeActivity.jsx';
import { ConfirmDialog } from '../components/common/ConfirmDialog.jsx';
import { DetailSkeleton } from '../components/common/Skeleton.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Button } from '../components/common/Button.jsx';
import { formatCurrency, formatExactDate, formatRelativeTime, calculatePriceChange, getStockStatus } from '../utils/formatters.js';
import { toast } from 'sonner';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: products = [], isLoading: isProductsLoading } = useTrackedProducts();
  const { data: history = [], isLoading: isHistoryLoading, isError: isHistoryError } = usePriceHistory(id);
  const { data: logs = [], isLoading: isLogsLoading } = useScrapeLogs(id);

  const manualScrapeMutation = useManualScrape();
  const untrackMutation = useUntrackProduct();

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Find product by DB UUID or store_product_id
  const product = useMemo(() => {
    if (!id || !products.length) return null;
    return products.find(p => p.id === id || String(p.store_product_id) === String(id)) || null;
  }, [id, products]);

  // Derived observations
  const latestObservation = history.length > 0 ? history[0] : null;
  const previousObservation = history.length > 1 ? history[1] : null;
  const baselineObservation = history.length > 0 ? history[history.length - 1] : null;

  const currentPrice = product?.current_price ?? latestObservation?.price ?? null;
  const baselinePrice = product?.baseline_price ?? baselineObservation?.price ?? null;
  const currentStock = product?.current_stock ?? latestObservation?.stock ?? null;

  const priceChange = calculatePriceChange(currentPrice, baselinePrice);
  const stockInfo = getStockStatus(currentStock, product?.latest_scrape_status === 'FAILED');

  const handleManualRefresh = async () => {
    if (!product) return;
    try {
      const res = await manualScrapeMutation.mutateAsync(product.id);
      if (res.success) {
        toast.success(`Price updated successfully: ${formatCurrency(res.price, res.currency)}`);
      } else {
        toast.error('Latest scrape check failed. Displaying last successful price observation.');
      }
    } catch (err) {
      toast.error(`Manual refresh error: ${err.message}`);
    }
  };

  const handleConfirmRemove = async () => {
    if (!product) return;
    try {
      await untrackMutation.mutateAsync(product.id);
      toast.success(`Product "${product.name}" removed from tracking.`);
      navigate('/products');
    } catch (err) {
      toast.error(`Unable to remove product: ${err.message}`);
    }
  };

  if (isProductsLoading) {
    return <DetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <Link to="/products" className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to tracked products
        </Link>
        <ErrorState
          title="Tracked Product Not Found"
          message={`No product with ID "${id}" exists in your tracking list.`}
        />
      </div>
    );
  }

  const hasFailedScrape = product.latest_scrape_status === 'FAILED';

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Back link */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-ine-800 pb-4">
        <Link to="/products" className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-950 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to tracked products
        </Link>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span>STORE PRODUCT ID #{product.store_product_id}</span>
        </div>
      </div>

      {/* Primary Product Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left: Product Icon Box */}
        <div className="md:col-span-4 bg-white dark:bg-ine-900 border border-neutral-200 dark:border-ine-800 p-8 flex items-center justify-center aspect-square relative group">
          <Package className="w-16 h-16 text-neutral-300 dark:text-neutral-700 stroke-[1.5]" />

          {/* External Store Link Button */}
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-ine-950/90 border border-neutral-200 dark:border-ine-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white backdrop-blur-xs transition-colors"
              title="Open product on INE Store website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Right: Product Metadata & Pricing Panel */}
        <div className="md:col-span-8 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                PRODUCT DETAILS &middot; SKU {product.sku || 'N/A'}
              </span>
            </div>

            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-neutral-950 dark:text-white leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Failed Scrape Stale Data Banner */}
          {hasFailedScrape && (
            <div className="p-3 bg-rose-50 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-mono flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <div>
                <span className="font-bold">Latest Scrape Failed:</span> Showing last known successful price observation. Previous data has been preserved.
              </div>
            </div>
          )}

          {/* Pricing Block */}
          <div className="p-6 bg-neutral-50 dark:bg-ine-900 border border-neutral-200 dark:border-ine-800 space-y-4">
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-neutral-400 block">
                  {hasFailedScrape ? 'Last Known Price' : 'Current Tracked Price'}
                </span>
                <span className="text-4xl font-serif font-bold text-neutral-950 dark:text-white tracking-tight">
                  {formatCurrency(currentPrice, product.currency)}
                </span>
              </div>

              {/* Price Movement Indicator Badge */}
              {priceChange ? (
                <div className={`flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 border ${
                  priceChange.direction === 'DROP'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                    : priceChange.direction === 'INCREASE'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-300 dark:bg-ine-800 dark:text-neutral-300'
                }`}>
                  {priceChange.direction === 'DROP' && <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />}
                  {priceChange.direction === 'INCREASE' && <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />}
                  {priceChange.direction === 'UNCHANGED' && <Minus className="w-4 h-4" />}
                  <span>
                    {priceChange.direction === 'DROP' ? '-' : priceChange.direction === 'INCREASE' ? '+' : ''}
                    {formatCurrency(priceChange.absolute, product.currency)} ({priceChange.percentage.toFixed(1)}%)
                  </span>
                </div>
              ) : (
                <span className="text-xs font-mono text-neutral-400">
                  Initial price check
                </span>
              )}
            </div>

            {/* Stock & Scrape Status Row */}
            <div className="pt-4 border-t border-neutral-200 dark:border-ine-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 uppercase">Availability:</span>
                <span className={`px-2 py-0.5 border ${stockInfo.badgeClass}`}>
                  {stockInfo.label}
                </span>
              </div>

              <div className="flex items-center gap-2 text-neutral-500">
                <span className="text-neutral-400 uppercase">Last checked:</span>
                <span>{formatRelativeTime(product.last_scraped_at)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="primary"
              onClick={handleManualRefresh}
              isLoading={manualScrapeMutation.isPending}
            >
              <RefreshCw className={`w-4 h-4 ${manualScrapeMutation.isPending ? 'animate-spin' : ''}`} />
              <span>Refresh Price Now</span>
            </Button>

            <Button
              variant="danger"
              onClick={() => setConfirmDeleteOpen(true)}
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove Product</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Interactive Recharts Price History Graph */}
      <PriceChart history={history} currency={product.currency} />

      {/* 3. Price Statistics Summary Grid */}
      <PriceStatistics product={product} history={history} />

      {/* 4. Scrape Activity Reliability Log */}
      <ScrapeActivity logs={logs} />

      {/* Remove product confirmation modal */}
      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={handleConfirmRemove}
        title="Remove product from price tracker?"
        description={`Are you sure you want to stop monitoring "${product.name}"? Historical observation data will be preserved in Supabase.`}
        confirmText="Remove Product"
        isLoading={untrackMutation.isPending}
      />
    </div>
  );
};
