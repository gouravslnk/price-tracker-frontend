import { request } from './client.js';

export const productsApi = {
  /**
   * Get all active tracked products with latest price & stock
   */
  async getTrackedProducts() {
    const res = await request('/products');
    return res.data || [];
  },

  /**
   * Search INE mock store catalog
   */
  async searchCatalog(query = '') {
    const q = encodeURIComponent(query.trim());
    const res = await request(`/products/search?q=${q}`);
    return res.data || [];
  },

  /**
   * Get product details directly from store by store product ID
   */
  async getStoreProductDetails(storeProductId) {
    const res = await request(`/products/details/${encodeURIComponent(storeProductId)}`);
    return res.data;
  },

  /**
   * Add a product to the tracking list
   */
  async trackProduct(payload) {
    const res = await request('/products/track', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    return res.data;
  },

  /**
   * Stop tracking a product
   */
  async untrackProduct(productId) {
    await request(`/products/track/${encodeURIComponent(productId)}`, {
      method: 'DELETE'
    });
  },

  /**
   * Get price history for a tracked product
   */
  async getPriceHistory(productId, limit = 100) {
    const res = await request(`/products/history/${encodeURIComponent(productId)}?limit=${limit}`);
    return res.data || [];
  },

  /**
   * Get scrape logs for a tracked product
   */
  async getScrapeLogs(productId, limit = 100) {
    const res = await request(`/products/logs/${encodeURIComponent(productId)}?limit=${limit}`);
    return res.data || [];
  },

  /**
   * Trigger manual price refresh for a tracked product
   */
  async manualScrape(productId, isHeaded = undefined) {
    const query = isHeaded !== undefined ? `?headed=${isHeaded}` : '';
    const res = await request(`/products/scrape/${encodeURIComponent(productId)}${query}`, {
      method: 'POST'
    });
    return res;
  },

  /**
   * Trigger full batch refresh for ALL tracked products (Cron/Manual trigger)
   */
  async refreshAllProducts(isHeaded = undefined) {
    const query = isHeaded !== undefined ? `?headed=${isHeaded}` : '';
    const res = await request(`/scrape/trigger${query}`, {
      method: 'POST'
    });
    return res;
  }
};
