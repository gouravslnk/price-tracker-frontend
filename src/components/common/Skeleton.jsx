import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Skeleton = ({ className }) => {
  return (
    <div className={twMerge(clsx('animate-pulse bg-neutral-200 dark:bg-ine-800', className))} />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="p-5 bg-white border border-neutral-200 dark:bg-ine-900 dark:border-ine-800 flex flex-col gap-4">
      <Skeleton className="h-32 w-full" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-ine-800">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
      <Skeleton className="h-4 w-32" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="h-96 w-full" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-48" />
          <div className="pt-4 flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
};
