import React, { useState } from 'react';
import { Activity, CheckCircle2, AlertTriangle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatExactDate, formatRelativeTime } from '../../utils/formatters.js';
import { Badge } from '../common/Badge.jsx';

export const ScrapeActivity = ({ logs = [] }) => {
  const [expandedLogId, setExpandedLogId] = useState(null);

  if (!logs || logs.length === 0) {
    return (
      <div className="p-6 border border-neutral-200 dark:border-ine-800 bg-white dark:bg-ine-900 text-center">
        <Activity className="w-6 h-6 text-neutral-400 mx-auto mb-2 stroke-[1.5]" />
        <h4 className="font-serif font-bold text-neutral-900 dark:text-white text-sm">
          No Scrape Logs Available
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Scrape attempt diagnostics will be recorded here when automated or manual price updates are run.
        </p>
      </div>
    );
  }

  const toggleExpand = (id) => {
    setExpandedLogId(prev => (prev === id ? null : id));
  };

  return (
    <div className="p-6 border border-neutral-200 dark:border-ine-800 bg-white dark:bg-ine-900 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-ine-800 pb-3">
        <h3 className="font-serif font-bold text-lg text-neutral-950 dark:text-white">
          Scraper Reliability & Activity Log
        </h3>
        <span className="text-xs font-mono text-neutral-400">
          Last {logs.length} attempts
        </span>
      </div>

      <div className="divide-y divide-neutral-100 dark:divide-ine-800/80 font-mono text-xs">
        {logs.map((log) => {
          const isExpanded = expandedLogId === log.id;
          const isSuccess = log.status === 'SUCCESS';
          const isRetry = log.status === 'RETRY';
          const isFailed = log.status === 'FAILED';

          return (
            <div key={log.id} className="py-3 transition-colors">
              <div
                onClick={() => toggleExpand(log.id)}
                className="flex items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50 dark:hover:bg-ine-800/40 p-1.5 -mx-1.5"
              >
                {/* Status Indicator & Timestamp */}
                <div className="flex items-center gap-3">
                  {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  {isRetry && <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />}
                  {isFailed && <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />}

                  <div>
                    <span className="font-bold text-neutral-900 dark:text-white mr-2">
                      {log.status}
                    </span>
                    <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                      {formatExactDate(log.created_at)} ({formatRelativeTime(log.created_at)})
                    </span>
                  </div>
                </div>

                {/* Duration & Expand Toggle */}
                <div className="flex items-center gap-4 text-neutral-500">
                  {log.http_status && (
                    <span className="text-[11px] px-1.5 py-0.5 border border-neutral-200 dark:border-ine-800">
                      HTTP {log.http_status}
                    </span>
                  )}
                  {log.duration_ms && (
                    <span className="text-[11px] text-neutral-400">
                      {log.duration_ms}ms
                    </span>
                  )}
                  {log.error_message && (
                    <button className="text-neutral-400 hover:text-neutral-950 dark:hover:text-white">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Error Details */}
              {isExpanded && log.error_message && (
                <div className="mt-2 p-3 bg-neutral-900 dark:bg-black text-rose-300 font-mono text-[11px] rounded-none border border-neutral-800 leading-relaxed overflow-x-auto">
                  <div className="font-bold text-neutral-400 mb-1">ERROR DETAILS:</div>
                  {log.error_message}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
