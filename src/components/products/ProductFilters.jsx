import React from 'react';
import { Search, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';

export const ProductFilters = ({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  selectedSort,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount
}) => {
  const filterTabs = [
    { id: 'ALL', label: 'All Products' },
    { id: 'IN_STOCK', label: 'In Stock' },
    { id: 'OUT_OF_STOCK', label: 'Out of Stock' },
    { id: 'PRICE_DROP', label: 'Price Drop' },
    { id: 'PRICE_INCREASE', label: 'Price Up' },
    { id: 'FAILED_SCRAPE', label: 'Scrape Failed' }
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar + Sort & View Options */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tracked products by name, SKU, brand, or store ID..."
            className="w-full pl-9 pr-8 py-2 bg-white dark:bg-ine-900 border border-neutral-300 dark:border-ine-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort & Grid/Table Toggle */}
        <div className="flex items-center gap-2">
          
          {/* Sort Selector */}
          <div className="relative flex items-center">
            <SlidersHorizontal className="absolute left-2.5 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
            <select
              value={selectedSort}
              onChange={(e) => onSortChange(e.target.value)}
              className="pl-8 pr-6 py-2 bg-white dark:bg-ine-900 border border-neutral-300 dark:border-ine-800 text-xs font-mono text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-950 dark:focus:ring-white cursor-pointer"
            >
              <option value="RECENTLY_UPDATED">Recently Updated</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="NAME">Product Name</option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center border border-neutral-300 dark:border-ine-800 bg-white dark:bg-ine-900 p-0.5">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Grid view"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Table view"
              aria-label="Table view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 border-b border-neutral-200 dark:border-ine-800">
        <div className="flex items-center gap-1">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                selectedFilter === tab.id
                  ? 'border-neutral-950 text-neutral-950 font-bold dark:border-white dark:text-white'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-xs font-mono text-neutral-400 dark:text-neutral-500 shrink-0 pr-1">
          {totalCount} {totalCount === 1 ? 'product' : 'products'}
        </div>
      </div>
    </div>
  );
};
