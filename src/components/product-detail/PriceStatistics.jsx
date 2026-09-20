import React, { useMemo } from 'react';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { formatCurrency, calculatePriceChange } from '../../utils/formatters.js';

export const PriceStatistics = ({ product, history = [] }) => {
  const stats = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        current: product?.current_price ?? null,
        lowest: product?.current_price ?? null,
        highest: product?.current_price ?? null,
        average: product?.current_price ?? null,
        baseline: product?.baseline_price ?? product?.current_price ?? null,
        previous: product?.previous_price ?? null,
        totalObservations: 0,
        mrpSavings: product?.mrp && product?.current_price ? product.mrp - product.current_price : null,
        discountPercent: product?.mrp && product?.current_price ? Math.round(((product.mrp - product.current_price) / product.mrp) * 100) : null
      };
    }

    const prices = history
      .map(h => h.price)
      .filter(p => p !== null && p !== undefined && !isNaN(p));

    if (prices.length === 0) {
      return {
        current: product?.current_price ?? null,
        lowest: null,
        highest: null,
        average: null,
        baseline: null,
        previous: null,
        totalObservations: 0,
        mrpSavings: null,
        discountPercent: null
      };
    }

    const lowest = Math.min(...prices);
    const highest = Math.max(...prices);
    const average = Math.round(prices.reduce((acc, p) => acc + p, 0) / prices.length);
    const current = product?.current_price ?? prices[0];
    const previous = history.length > 1 ? history[1].price : (product?.previous_price ?? null);
    const baseline = history[history.length - 1].price;

    const mrp = product?.mrp || (history[0]?.mrp ?? null);
    const mrpSavings = mrp && current ? mrp - current : null;
    const discountPercent = mrp && current && mrp > current ? Math.round(((mrp - current) / mrp) * 100) : null;

    return {
      current,
      lowest,
      highest,
      average,
      baseline,
      previous,
      totalObservations: prices.length,
      mrpSavings,
      discountPercent
    };
  }, [product, history]);

  const currency = product?.currency || 'INR';

  const sinceLastCheck = calculatePriceChange(stats.current, stats.previous);
  const sinceTracking = calculatePriceChange(stats.current, stats.baseline);

  return (
    <div className="p-6 border border-neutral-200 dark:border-ine-800 bg-white dark:bg-ine-900 space-y-6">
      <div className="flex flex-wrap items-center justify-between border-b border-neutral-100 dark:border-ine-800 pb-3 gap-2">
        <h3 className="font-serif font-bold text-lg text-neutral-950 dark:text-white">
          Tracked Price Statistics & Movement
        </h3>
        <span className="text-xs font-mono text-neutral-400">
          Scoped since tracking began ({stats.totalObservations} {stats.totalObservations === 1 ? 'observation' : 'observations'})
        </span>
      </div>

      {/* Main 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-sans">
        
        {/* Current */}
        <div className="p-4 bg-neutral-50 dark:bg-ine-950 border border-neutral-200 dark:border-ine-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Current Price
          </div>
          <div className="text-xl font-serif font-bold text-neutral-950 dark:text-white mt-1">
            {formatCurrency(stats.current, currency)}
          </div>
        </div>

        {/* Lowest Tracked */}
        <div className="p-4 bg-neutral-50 dark:bg-ine-950 border border-neutral-200 dark:border-ine-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Lowest Tracked Price
          </div>
          <div className="text-xl font-serif font-bold text-emerald-700 dark:text-emerald-400 mt-1">
            {formatCurrency(stats.lowest, currency)}
          </div>
        </div>

        {/* Highest Tracked */}
        <div className="p-4 bg-neutral-50 dark:bg-ine-950 border border-neutral-200 dark:border-ine-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Highest Tracked Price
          </div>
          <div className="text-xl font-serif font-bold text-rose-700 dark:text-rose-400 mt-1">
            {formatCurrency(stats.highest, currency)}
          </div>
        </div>

        {/* Average Tracked */}
        <div className="p-4 bg-neutral-50 dark:bg-ine-950 border border-neutral-200 dark:border-ine-800">
          <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Average Tracked Price
          </div>
          <div className="text-xl font-serif font-bold text-neutral-900 dark:text-white mt-1">
            {formatCurrency(stats.average, currency)}
          </div>
        </div>
      </div>

      {/* Movement Comparison Grid (Since Last Check & Since Tracking) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Since Last Check */}
        <div className="p-4 bg-neutral-50 dark:bg-ine-950 border border-neutral-200 dark:border-ine-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500">
              Movement Since Last Check
            </div>
            <div className="text-xs font-mono text-neutral-500 mt-0.5">
              Previous check: {formatCurrency(stats.previous, currency)}
            </div>
          </div>
          {sinceLastCheck ? (
            <div className={`flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 border ${
              sinceLastCheck.direction === 'DROP'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                : sinceLastCheck.direction === 'INCREASE'
                ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-ine-800 dark:text-neutral-400'
            }`}>
              {sinceLastCheck.direction === 'DROP' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {sinceLastCheck.direction === 'INCREASE' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {sinceLastCheck.direction === 'UNCHANGED' && <Minus className="w-3.5 h-3.5" />}
              <span>
                {sinceLastCheck.direction === 'DROP' ? '-' : sinceLastCheck.direction === 'INCREASE' ? '+' : ''}
                {formatCurrency(sinceLastCheck.absolute, currency)} ({sinceLastCheck.percentage.toFixed(1)}%)
              </span>
            </div>
          ) : (
            <span className="text-xs font-mono text-neutral-400">Initial price check</span>
          )}
        </div>

        {/* Since Tracking Started */}
        <div className="p-4 bg-neutral-50 dark:bg-ine-950 border border-neutral-200 dark:border-ine-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono uppercase text-neutral-400 dark:text-neutral-500">
              Movement Since Tracking Started
            </div>
            <div className="text-xs font-mono text-neutral-500 mt-0.5">
              Baseline: {formatCurrency(stats.baseline, currency)}
            </div>
          </div>
          {sinceTracking ? (
            <div className={`flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 border ${
              sinceTracking.direction === 'DROP'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                : sinceTracking.direction === 'INCREASE'
                ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-ine-800 dark:text-neutral-400'
            }`}>
              {sinceTracking.direction === 'DROP' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {sinceTracking.direction === 'INCREASE' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {sinceTracking.direction === 'UNCHANGED' && <Minus className="w-3.5 h-3.5" />}
              <span>
                {sinceTracking.direction === 'DROP' ? '-' : sinceTracking.direction === 'INCREASE' ? '+' : ''}
                {formatCurrency(sinceTracking.absolute, currency)} ({sinceTracking.percentage.toFixed(1)}%)
              </span>
            </div>
          ) : (
            <span className="text-xs font-mono text-neutral-400">Baseline established</span>
          )}
        </div>
      </div>
    </div>
  );
};

