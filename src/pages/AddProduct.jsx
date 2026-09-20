import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, Check, ArrowLeft, Package, ShoppingBag } from 'lucide-react';
import { useSearchCatalog, useTrackedProducts, useTrackProduct } from '../hooks/useProducts.js';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { CardSkeleton } from '../components/common/Skeleton.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { toast } from 'sonner';

export const AddProduct = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [trackingId, setTrackingId] = useState(null);

  const { data: catalogResults = [], isLoading, isError, error, refetch } = useSearchCatalog(searchTerm);
  const { data: trackedProducts = [] } = useTrackedProducts();
  const trackMutation = useTrackProduct();

  // Create a quick lookup set of already tracked store product IDs
  const trackedStoreIds = new Set(trackedProducts.map(p => String(p.store_product_id)));

  const handleTrackProduct = async (item) => {
    setTrackingId(item.id);
    try {
      await trackMutation.mutateAsync({
        storeProductId: String(item.id),
        name: item.name,
        sku: item.sku,
        url: item.url,
        imageUrl: item.image_url || item.image
      });
      toast.success(`Started tracking "${item.name}".`);
      navigate('/');
    } catch (err) {
      toast.error(`Unable to track product: ${err.message}`);
    } finally {
      setTrackingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header & Back Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-ine-800 pb-6">
        <div>
          <Link to="/products" className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-neutral-500 hover:text-neutral-950 dark:hover:text-white mb-2">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to directory
          </Link>
          <h1 className="font-serif font-bold text-3xl text-neutral-950 dark:text-white">
            Track a Product from INE Store
          </h1>
          <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-1">
            Search live catalog products from demo.inelabteamdev.com to add to your tracker
          </p>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="p-6 bg-white dark:bg-ine-900 border border-neutral-200 dark:border-ine-800 space-y-3">
        <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400">
          SEARCH STORE CATALOG
        </label>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type a product name, keyword, or store ID (e.g. Air Fryer, 275)..."
            className="w-full pl-11 pr-4 py-3 bg-neutral-50 dark:bg-ine-950 border border-neutral-300 dark:border-ine-800 text-base text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition-colors"
            autoFocus
          />
        </div>
        <p className="text-xs font-mono text-neutral-400">
          Search live catalog items or enter store product ID.
        </p>
      </div>

      {/* Search Results Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-ine-800 pb-2">
          <h2 className="font-serif font-bold text-xl text-neutral-950 dark:text-white">
            Catalog Search Results
          </h2>
          {searchTerm && (
            <span className="text-xs font-mono text-neutral-400">
              {catalogResults.length} item{catalogResults.length === 1 ? '' : 's'} found
            </span>
          )}
        </div>

        {!searchTerm ? (
          <div className="py-16 text-center border border-dashed border-neutral-300 dark:border-ine-800 bg-neutral-50/50 dark:bg-ine-900/30">
            <ShoppingBag className="w-10 h-10 text-neutral-400 mx-auto mb-3 stroke-[1.5]" />
            <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white">
              Search the INE Store Catalog
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 leading-relaxed">
              Type keywords above to search live store items. Click "Track Product" to begin real-time automated price monitoring.
            </p>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : isError ? (
          <ErrorState
            title="Catalog search error"
            message={error?.message || 'Unable to fetch store catalog.'}
            onRetry={refetch}
          />
        ) : catalogResults.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-neutral-300 dark:border-ine-800 bg-neutral-50/50 dark:bg-ine-900/30">
            <h3 className="font-serif font-bold text-lg text-neutral-900 dark:text-white">
              No products found
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              No store products match "{searchTerm}". Try searching for another keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogResults.map(item => {
              const isAlreadyTracked = trackedStoreIds.has(String(item.id));
              const isPendingThis = trackingId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-5 bg-white dark:bg-ine-900 border border-neutral-200 dark:border-ine-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header ID */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase">
                      <span>STORE ID #{item.id}</span>
                      {isAlreadyTracked && (
                        <Badge variant="success" size="sm">
                          Tracked
                        </Badge>
                      )}
                    </div>

                    {/* Product Icon Box */}
                    <div className="h-28 w-full bg-neutral-50 dark:bg-ine-950 border border-neutral-100 dark:border-ine-800 flex items-center justify-center">
                      <Package className="w-8 h-8 text-neutral-300 dark:text-neutral-700 stroke-[1.5]" />
                    </div>

                    {/* Name & SKU */}
                    <div>
                      <h3 className="font-serif font-bold text-base text-neutral-950 dark:text-white line-clamp-2">
                        {item.name}
                      </h3>
                      {item.sku && (
                        <p className="text-xs font-mono text-neutral-500 mt-1">
                          SKU: {item.sku}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-3 border-t border-neutral-100 dark:border-ine-800">
                    {isAlreadyTracked ? (
                      <Button variant="outline" size="sm" className="w-full" disabled>
                        <Check className="w-4 h-4 mr-1.5" />
                        <span>Already Tracked</span>
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        onClick={() => handleTrackProduct(item)}
                        isLoading={isPendingThis}
                      >
                        <Plus className="w-4 h-4 mr-1.5" />
                        <span>Track Product</span>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
