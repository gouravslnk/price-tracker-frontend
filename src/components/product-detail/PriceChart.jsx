import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatExactDate, formatCurrency } from '../../utils/formatters.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { TrendingUp } from 'lucide-react';

export const PriceChart = ({ history = [], currency = 'INR' }) => {
  const { theme } = useTheme();
  const [range, setRange] = useState('ALL'); // 7D | 30D | 90D | ALL

  // Process & filter data based on selected range
  const chartData = useMemo(() => {
    if (!history || history.length === 0) return [];

    // Filter valid numeric prices
    const valid = history.filter(h => h.price !== null && h.price !== undefined && !isNaN(h.price));
    if (valid.length === 0) return [];

    // Sort chronologically (oldest to newest for chart display)
    const sorted = [...valid].sort((a, b) => new Date(a.scraped_at).getTime() - new Date(b.scraped_at).getTime());

    if (range === 'ALL') return sorted;

    const now = new Date().getTime();
    const daysMap = { '7D': 7, '30D': 30, '90D': 90 };
    const cutoffDays = daysMap[range] || 30;
    const cutoffTime = now - cutoffDays * 24 * 60 * 60 * 1000;

    return sorted.filter(item => new Date(item.scraped_at).getTime() >= cutoffTime);
  }, [history, range]);

  const ranges = ['7D', '30D', '90D', 'ALL'];

  const strokeColor = theme === 'dark' ? '#f5f5f5' : '#171717';
  const gridColor = theme === 'dark' ? '#262626' : '#e5e5e5';

  if (!history || history.length === 0) {
    return (
      <div className="p-8 border border-neutral-200 dark:border-ine-800 bg-white dark:bg-ine-900 text-center">
        <TrendingUp className="w-8 h-8 text-neutral-400 mx-auto mb-2 stroke-[1.5]" />
        <h4 className="font-serif font-bold text-neutral-900 dark:text-white text-base">
          No Price History Recorded Yet
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
          Price history observations will populate automatically as scraper checks are executed over time.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 border border-neutral-200 dark:border-ine-800 bg-white dark:bg-ine-900 space-y-4">
      
      {/* Header & Range Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-ine-800/80 pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-neutral-950 dark:text-white">
            Price Trend & History
          </h3>
          <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
            {chartData.length} observation{chartData.length === 1 ? '' : 's'} recorded
          </p>
        </div>

        {/* Range Tabs */}
        <div className="flex items-center gap-1 border border-neutral-300 dark:border-ine-800 p-0.5 bg-neutral-50 dark:bg-ine-950">
          {ranges.map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-mono font-medium transition-colors cursor-pointer ${
                range === r
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas or Single Data Point State */}
      {chartData.length === 1 ? (
        <div className="py-12 text-center bg-neutral-50/50 dark:bg-ine-950/40 border border-neutral-100 dark:border-ine-800">
          <div className="text-2xl font-serif font-bold text-neutral-950 dark:text-white">
            {formatCurrency(chartData[0].price, currency)}
          </div>
          <p className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mt-1">
            First observation recorded on {formatExactDate(chartData[0].scraped_at)}
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
            A line graph will appear as additional price data points are collected over time.
          </p>
        </div>
      ) : chartData.length > 1 ? (
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="scraped_at"
                tickFormatter={(str) => {
                  try {
                    const d = new Date(str);
                    return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
                  } catch {
                    return str;
                  }
                }}
                stroke="#a3a3a3"
                fontSize={10}
                fontFamily="monospace"
                tickLine={false}
              />
              <YAxis
                domain={[
                  (dataMin) => Math.max(0, Math.floor(dataMin * 0.85)),
                  (dataMax) => Math.ceil(dataMax * 1.15)
                ]}
                tickFormatter={(val) => formatCurrency(val, currency)}
                stroke="#a3a3a3"
                fontSize={10}
                fontFamily="monospace"
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white dark:bg-ine-950 border border-neutral-300 dark:border-ine-800 p-3 shadow-md space-y-1 font-mono text-xs">
                        <div className="text-neutral-400 text-[10px]">
                          {formatExactDate(data.scraped_at)}
                        </div>
                        <div className="text-base font-serif font-bold text-neutral-950 dark:text-white">
                          {formatCurrency(data.price, currency)}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Stock: {data.stock !== null && data.stock !== undefined ? `${data.stock} units` : 'Unknown'}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={strokeColor}
                strokeWidth={2}
                dot={{ r: 3, fill: strokeColor }}
                activeDot={{ r: 6, fill: strokeColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="py-12 text-center text-xs text-neutral-500 font-mono">
          No price observations recorded within the selected "{range}" timeframe.
        </div>
      )}
    </div>
  );
};
