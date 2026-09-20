import { formatDistanceToNow, format, parseISO } from 'date-fns';

/**
 * Format currency nicely (e.g. ₹4,821 or $149.99)
 */
export function formatCurrency(amount, currency = 'INR') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '—';
  }

  const symbolMap = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const symbol = symbolMap[String(currency).toUpperCase()] || currency;
  const formatted = Number(amount).toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2
  });

  return `${symbol}${formatted}`;
}

/**
 * Format ISO timestamp into relative time string ("2 hours ago", "just now")
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Never';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '—';
  }
}

/**
 * Format ISO timestamp into exact date string ("Sep 20, 2026 at 10:15 AM")
 */
export function formatExactDate(dateString) {
  if (!dateString) return 'Never';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
    return format(date, 'MMM d, yyyy · h:mm a');
  } catch {
    return '—';
  }
}

/**
 * Calculate absolute and percentage change between two prices
 */
export function calculatePriceChange(current, previous) {
  if (current === null || current === undefined || previous === null || previous === undefined || previous === 0) {
    return null;
  }

  const diff = current - previous;
  const percent = ((current - previous) / previous) * 100;

  let direction = 'UNCHANGED';
  if (diff < 0) direction = 'DROP';
  else if (diff > 0) direction = 'INCREASE';

  return {
    absolute: Math.abs(diff),
    percentage: Math.abs(percent),
    rawDifference: diff,
    rawPercentage: percent,
    direction
  };
}

/**
 * Evaluates availability semantics safely:
 * - stock > 0 => In stock (X units)
 * - stock === 0 => Out of stock (ONLY if scrape succeeded)
 * - missing/failed => Availability unavailable
 */
export function getStockStatus(stock, hasFailedScrape = false) {
  if (hasFailedScrape && (stock === null || stock === undefined)) {
    return {
      label: 'Availability unavailable',
      isAvailable: false,
      isUnknown: true,
      badgeClass: 'bg-neutral-100 text-neutral-600 dark:bg-ine-800 dark:text-neutral-400 border-neutral-300 dark:border-ine-700'
    };
  }

  if (stock !== null && stock !== undefined && stock > 0) {
    return {
      label: `In stock · ${stock} ${stock === 1 ? 'unit' : 'units'}`,
      isAvailable: true,
      isUnknown: false,
      badgeClass: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60'
    };
  }

  if (stock === 0) {
    return {
      label: 'Out of stock',
      isAvailable: false,
      isUnknown: false,
      badgeClass: 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300 dark:border-rose-800/60'
    };
  }

  return {
    label: 'Status unknown',
    isAvailable: false,
    isUnknown: true,
    badgeClass: 'bg-neutral-100 text-neutral-600 dark:bg-ine-800 dark:text-neutral-400 border-neutral-300 dark:border-ine-700'
  };
}

/**
 * Maps raw filter key enum constants to human-readable strings
 */
export function getFilterLabel(filterId) {
  const labels = {
    ALL: 'All Products',
    IN_STOCK: 'In Stock',
    OUT_OF_STOCK: 'Out of Stock',
    PRICE_DROP: 'Price Drop',
    PRICE_INCREASE: 'Price Up',
    FAILED_SCRAPE: 'Scrape Failed'
  };
  return labels[filterId] || filterId;
}

