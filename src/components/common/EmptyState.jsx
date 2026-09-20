import React from 'react';
import { PackageX } from 'lucide-react';

export const EmptyState = ({
  title,
  description,
  action,
  icon
}) => {
  return (
    <div className="py-16 px-6 text-center border border-dashed border-neutral-300 dark:border-ine-800 bg-neutral-50/50 dark:bg-ine-900/30 flex flex-col items-center justify-center">
      <div className="p-3 bg-white dark:bg-ine-800 border border-neutral-200 dark:border-ine-700 text-neutral-500 dark:text-neutral-400 mb-4">
        {icon || <PackageX className="w-8 h-8 stroke-[1.5]" />}
      </div>
      <h3 className="text-lg font-serif font-bold text-neutral-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
