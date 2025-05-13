// FavoriteItemSkeleton.jsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

// Individual Favorite Item Skeleton
export const FavoriteItemSkeleton = () => {
  return (
    <Card className="mb-6 overflow-hidden rounded-xl border-0 shadow-lg max-w-5xl">
      <div className="p-4 sm:p-6 max-w-xl">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Image skeleton */}
          <div className="flex-shrink-0 relative">
            <Skeleton className="h-64 w-64 rounded-lg" />
            <Skeleton className="absolute top-2 left-2 h-5 w-20 rounded-full" />
          </div>

          {/* Content skeletons */}
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-5 w-24 mb-2 rounded-full" />
                <Skeleton className="h-7 w-48 mb-1" />
                <Skeleton className="h-6 w-20 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-4" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
            <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
              <Skeleton className="h-10 rounded-md" />
              <Skeleton className="h-10 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Multiple Favorite Items Skeleton
export const FavoriteItemsListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <FavoriteItemSkeleton key={index} />
        ))}
    </div>
  );
};
