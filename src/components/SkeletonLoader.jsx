import { Skeleton } from '@heroui/react';

export function SkeletonLoader() {
  return (
    <div className="w-full space-y-3">
      <Skeleton className="h-15 w-full rounded-2xl" />
      <Skeleton className="h-15 w-full rounded-2xl" />
      <Skeleton className="h-15 w-full rounded-2xl" />
      <Skeleton className="h-15 w-full rounded-2xl" />
      <Skeleton className="h-15 w-full rounded-2xl" />
    </div>
  );
}
