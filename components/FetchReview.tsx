"use client";
import { useReviews } from "./Reviewcontext";
import { Star, MessageCircle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function FetchReview() {
  const { reviews, loading, error } = useReviews();

  if (loading) {
    return (
      <div className="w-full  space-y-3 mx-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800"
          >
            <div className="space-y-3">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-600 rounded w-24 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 w-full">
        <MessageCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-700 dark:text-red-300">
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 w-full">
        <MessageCircle className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          No reviews yet
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">
          Be the first to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Reviews ({reviews.length})
        </h2>
      </div>

      {reviews.map((review) => (
        <div
          key={review.reviewId}
          className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800 hover:border-neutral-200 cursor-pointer dark:hover:border-neutral-700 transition-colors"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < review.stars
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {review.stars} stars
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
            {review.content}
          </p>

          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Clock size={12} />
            <span>
              {new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
