import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/productsApi.js';

export const QUERY_KEYS = {
  trackedProducts: ['tracked-products'],
  priceHistory: (productId) => ['price-history', productId],
  scrapeLogs: (productId) => ['scrape-logs', productId],
  catalogSearch: (query) => ['catalog-search', query],
  productDetails: (storeProductId) => ['product-details', storeProductId]
};

/**
 * Fetch list of all tracked products
 */
export function useTrackedProducts() {
  return useQuery({
    queryKey: QUERY_KEYS.trackedProducts,
    queryFn: () => productsApi.getTrackedProducts(),
    staleTime: 1000,
    refetchInterval: (query) => {
      const data = query?.state?.data;
      if (Array.isArray(data)) {
        // If any product is unscraped, null current_price, or missing last_scraped_at, poll quickly every 2 seconds
        const hasPending = data.some(
          (p) => p.current_price === null || p.current_price === undefined || !p.last_scraped_at
        );
        if (hasPending) {
          return 2000;
        }
      }
      // Live dashboard refresh every 8 seconds
      return 8000;
    }
  });
}

/**
 * Fetch price history observations for a tracked product
 */
export function usePriceHistory(productId) {
  return useQuery({
    queryKey: QUERY_KEYS.priceHistory(productId || ''),
    queryFn: () => productsApi.getPriceHistory(productId),
    enabled: !!productId,
    staleTime: 1000,
    refetchInterval: 3000
  });
}

/**
 * Fetch diagnostic scrape activity logs for a tracked product
 */
export function useScrapeLogs(productId) {
  return useQuery({
    queryKey: QUERY_KEYS.scrapeLogs(productId || ''),
    queryFn: () => productsApi.getScrapeLogs(productId),
    enabled: !!productId,
    staleTime: 1000,
    refetchInterval: 3000
  });
}

/**
 * Search the live INE store catalog
 */
export function useSearchCatalog(query) {
  return useQuery({
    queryKey: QUERY_KEYS.catalogSearch(query || ''),
    queryFn: () => productsApi.searchCatalog(query),
    enabled: Boolean(query && query.trim().length > 0),
    staleTime: 60 * 1000
  });
}

/**
 * Mutation to track a product
 */
export function useTrackProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => productsApi.trackProduct(payload),
    onSuccess: () => {
      // Invalidate immediately to show newly created item on dashboard
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts });
      
      // Schedule successive refetches while Playwright background scraper runs
      setTimeout(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts }), 2000);
      setTimeout(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts }), 4000);
      setTimeout(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts }), 7000);
      setTimeout(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts }), 11000);
    }
  });
}

/**
 * Mutation to stop tracking a product
 */
export function useUntrackProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => productsApi.untrackProduct(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.priceHistory(productId) });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.scrapeLogs(productId) });
    }
  });
}

/**
 * Mutation to trigger a manual scrape refresh
 */
export function useManualScrape() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => productsApi.manualScrape(productId),
    onSuccess: (res, productId) => {
      if (res && res.success) {
        queryClient.setQueryData(QUERY_KEYS.trackedProducts, (old) => {
          if (!Array.isArray(old)) return old;
          return old.map((p) => {
            if (p.id === productId || String(p.store_product_id) === String(productId)) {
              return {
                ...p,
                previous_price: p.current_price !== null && p.current_price !== undefined ? p.current_price : res.price,
                current_price: res.price,
                current_stock: res.stock,
                mrp: res.mrp || p.mrp,
                currency: res.currency || p.currency || 'INR',
                last_scraped_at: res.scrapedAt || new Date().toISOString(),
                latest_scrape_status: 'SUCCESS'
              };
            }
            return p;
          });
        });
      }

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.priceHistory(productId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.scrapeLogs(productId) });
      setTimeout(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts }), 1500);
      setTimeout(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts }), 3500);
    }
  });
}

/**
 * Mutation to trigger full batch scrape across ALL tracked products
 */
export function useRefreshAllProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productsApi.refreshAllProducts(),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts });
      // Schedule successive refetches while Playwright batch workers run
      setTimeout(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts }), 3000);
      setTimeout(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts }), 6000);
      setTimeout(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts }), 10000);
      setTimeout(() => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.trackedProducts }), 15000);
    }
  });
}
