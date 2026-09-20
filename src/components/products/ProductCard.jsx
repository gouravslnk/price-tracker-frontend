import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Minus, Package, Trash2, RefreshCw } from 'lucide-react';
import { formatCurrency, formatRelativeTime, calculatePriceChange, getStockStatus } from '../../utils/formatters.js';
import { Badge } from '../common/Badge.jsx';
import { Button } from '../common/Button.jsx';

export const ProductCard = ({
  product,
  onRemove,
  onRefresh,
  isRefreshing = false
}) => {
  const priceChange = calculatePriceChange(product.current_price, product.baseline_price);
  const stockInfo = getStockStatus(product.current_stock, product.latest_scrape_status === 'FAILED');

  const hasFailedScrape = product.latest_scrape_status === 'FAILED';

  return (
    <div className="group relative bg-white dark:bg-ine-900 border border-neutral-200 dark:border-ine-800 hover:border-neutral-400 dark:hover:border-ine-600 transition-all duration-150 flex flex-col justify-between h-full overflow-hidden">
      
      {/* Top Header & Product Info */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Category & Status Row */}
        <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 min-h-[20px]">
          <span className="truncate">STORE ID #{product.store_product_id}</span>
          
          {hasFailedScrape ? (
            <Badge variant="danger" size="sm">
              Scrape Failed
            </Badge>
          ) : product.current_price === null && !product.last_scraped_at ? (
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-1.5 py-0.5 border text-[10px] font-mono whitespace-nowrap flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              SCRAPING...
            </span>
          ) : (
            <span className={stockInfo.badgeClass + ' px-1.5 py-0.5 border text-[10px] font-mono whitespace-nowrap'}>
              {stockInfo.label}
            </span>
          )}
        </div>

        {/* Product Icon Box */}
        <div className="relative h-32 w-full bg-neutral-50 dark:bg-ine-950 border border-neutral-100 dark:border-ine-800 flex items-center justify-center">
          <Package className="w-10 h-10 text-neutral-300 dark:text-neutral-700 stroke-[1.5]" />

          {/* Quick Refresh Overlay Button */}
          {onRefresh && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onRefresh(product);
              }}
              disabled={isRefreshing}
              className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-ine-900/90 text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white border border-neutral-200 dark:border-ine-800 backdrop-blur-xs transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-50 cursor-pointer"
              title="Refresh price"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>

        {/* Name & SKU - Fixed Heights for Uniform Grid Alignment */}
        <div className="space-y-1">
          <Link to={`/products/${product.id}`} className="hover:underline block">
            <h3 className="font-serif font-bold text-base text-neutral-900 dark:text-white line-clamp-2 leading-snug min-h-[2.6rem]">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 min-h-[1rem]">
            {product.sku ? `SKU: ${product.sku}` : ''}
          </p>
        </div>
      </div>

      {/* Pricing & Movement Section */}
      <div className="px-4 pb-4 space-y-3">
        <div className="pt-3 border-t border-neutral-100 dark:border-ine-800/80 space-y-2">
          
          {/* Label & Movement Badge (Since Tracking Started) */}
          <div className="flex items-center justify-between gap-2 min-h-[24px]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
              {hasFailedScrape ? 'Last Known Price' : 'Current Price'}
            </span>

            {priceChange ? (
              <div className={`flex items-center gap-1 font-mono text-[11px] font-semibold px-2 py-0.5 border whitespace-nowrap ${
                priceChange.direction === 'DROP'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                  : priceChange.direction === 'INCREASE'
                  ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-ine-800 dark:text-neutral-400 dark:border-ine-700'
              }`} title="Price movement since tracking started">
                {priceChange.direction === 'DROP' && <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />}
                {priceChange.direction === 'INCREASE' && <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />}
                {priceChange.direction === 'UNCHANGED' && <Minus className="w-3 h-3" />}
                <span>
                  {priceChange.direction === 'DROP'
                    ? `-${formatCurrency(priceChange.absolute, product.currency)} (${priceChange.percentage.toFixed(1)}%)`
                    : priceChange.direction === 'INCREASE'
                    ? `+${formatCurrency(priceChange.absolute, product.currency)} (${priceChange.percentage.toFixed(1)}%)`
                    : 'No Change'}
                </span>
              </div>
            ) : (
              <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                Initial baseline
              </span>
            )}
          </div>

          {/* Large Price Number */}
          <div className="flex items-baseline justify-between gap-2 min-h-[32px]">
            <div className="text-2xl font-serif font-bold text-neutral-950 dark:text-white tracking-tight">
              {product.current_price !== null && product.current_price !== undefined ? (
                formatCurrency(product.current_price, product.currency)
              ) : hasFailedScrape ? (
                <span className="text-neutral-400 text-lg font-mono">—</span>
              ) : (
                <span className="text-neutral-400 dark:text-neutral-500 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-400 shrink-0" />
                  Fetching price...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer timestamp & Actions */}
        <div className="pt-3 border-t border-neutral-100 dark:border-ine-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-mono text-[11px]">
            Updated {formatRelativeTime(product.last_scraped_at)}
          </span>

          <div className="flex items-center gap-2">
            {onRemove && (
              <button
                onClick={() => onRemove(product)}
                className="p-1 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                title="Remove from tracking"
                aria-label="Remove product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <Link to={`/products/${product.id}`}>
              <Button size="sm" variant="outline" className="py-1 px-2.5 text-xs">
                Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

