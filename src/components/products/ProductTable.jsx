import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Minus, Package, Trash2, RefreshCw } from 'lucide-react';
import { formatCurrency, formatRelativeTime, calculatePriceChange, getStockStatus } from '../../utils/formatters.js';
import { Button } from '../common/Button.jsx';

export const ProductTable = ({
  products,
  onRemove,
  onRefresh
}) => {
  return (
    <div className="w-full overflow-x-auto border border-neutral-200 dark:border-ine-800 bg-white dark:bg-ine-900">
      <table className="w-full text-left text-xs font-sans">
        <thead className="bg-neutral-50 dark:bg-ine-950 border-b border-neutral-200 dark:border-ine-800 text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 select-none">
          <tr>
            <th className="py-3 px-4 font-semibold">Product</th>
            <th className="py-3 px-4 font-semibold">SKU</th>
            <th className="py-3 px-4 font-semibold">Current Price</th>
            <th className="py-3 px-4 font-semibold">Movement</th>
            <th className="py-3 px-4 font-semibold">Stock</th>
            <th className="py-3 px-4 font-semibold">Updated</th>
            <th className="py-3 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100 dark:divide-ine-800/80">
          {products.map(product => {
            const priceChange = calculatePriceChange(product.current_price, product.baseline_price);
            const stockInfo = getStockStatus(product.current_stock, product.latest_scrape_status === 'FAILED');

            return (
              <tr key={product.id} className="hover:bg-neutral-50/60 dark:hover:bg-ine-800/40 transition-colors">
                
                {/* Product Name & Icon */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-neutral-100 dark:bg-ine-950 border border-neutral-200 dark:border-ine-800 shrink-0 flex items-center justify-center">
                      <Package className="w-4 h-4 text-neutral-400 dark:text-neutral-500 stroke-[1.5]" />
                    </div>
                    <div>
                      <Link to={`/products/${product.id}`} className="font-serif font-bold text-sm text-neutral-900 dark:text-white hover:underline line-clamp-1">
                        {product.name}
                      </Link>
                      <span className="text-[10px] font-mono text-neutral-400 block">
                        ID: {product.store_product_id}
                      </span>
                    </div>
                  </div>
                </td>

                {/* SKU */}
                <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                  {product.sku || '—'}
                </td>

                {/* Price */}
                <td className="py-3 px-4 font-serif font-bold text-sm text-neutral-900 dark:text-white">
                  {product.current_price !== null && product.current_price !== undefined ? (
                    formatCurrency(product.current_price, product.currency)
                  ) : product.latest_scrape_status === 'FAILED' ? (
                    <span className="text-neutral-400 font-mono text-xs">—</span>
                  ) : (
                    <span className="text-neutral-400 font-mono text-xs inline-flex items-center gap-1.5">
                      <RefreshCw className="w-3 h-3 animate-spin text-neutral-400" /> Fetching...
                    </span>
                  )}
                </td>

                {/* Movement */}
                <td className="py-3 px-4 font-mono">
                  {priceChange ? (
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      priceChange.direction === 'DROP' ? 'text-emerald-600 dark:text-emerald-400' :
                      priceChange.direction === 'INCREASE' ? 'text-rose-600 dark:text-rose-400' :
                      'text-neutral-500'
                    }`}>
                      {priceChange.direction === 'DROP' && <ArrowDownRight className="w-3.5 h-3.5" />}
                      {priceChange.direction === 'INCREASE' && <ArrowUpRight className="w-3.5 h-3.5" />}
                      {priceChange.direction === 'UNCHANGED' && <Minus className="w-3.5 h-3.5" />}
                      {priceChange.direction === 'DROP' ? '-' : priceChange.direction === 'INCREASE' ? '+' : ''}
                      {formatCurrency(priceChange.absolute, product.currency)}
                    </span>
                  ) : (
                    <span className="text-neutral-400 text-xs">Initial</span>
                  )}
                </td>

                {/* Stock */}
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-0.5 border text-[10px] font-mono ${stockInfo.badgeClass}`}>
                    {stockInfo.label}
                  </span>
                </td>

                {/* Updated */}
                <td className="py-3 px-4 font-mono text-neutral-500 text-xs whitespace-nowrap">
                  {formatRelativeTime(product.last_scraped_at)}
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    {onRefresh && (
                      <button
                        onClick={() => onRefresh(product)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-ine-800 cursor-pointer"
                        title="Refresh price"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onRemove && (
                      <button
                        onClick={() => onRemove(product)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 border border-neutral-200 dark:border-ine-800 cursor-pointer"
                        title="Remove product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <Link to={`/products/${product.id}`}>
                      <Button size="sm" variant="outline" className="py-1 px-2.5">
                        View
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
