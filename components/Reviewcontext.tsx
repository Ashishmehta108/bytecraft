"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

type Review = {
  reviewId: string;
  createdAt: string;
  content: string;
  stars: number;
  productId: string;
};

interface ReviewContextType {
  id: string;
  reviews: Review[];
  loading: boolean;
  error: string;
  refreshReviews: () => Promise<void>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  clearReviews: () => void;
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export function ReviewProvider({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/reviews/${id}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data: Review[] = await response.json();
      setReviews(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const clearReviews = useCallback(() => {
    setReviews([]);
    setError("");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (id) fetchReviews();
    else clearReviews();
  }, [id, fetchReviews, clearReviews]);

  return (
    <ReviewContext.Provider
      value={{
        setError,
        setLoading,
        id,
        reviews,
        loading,
        error,
        refreshReviews: fetchReviews,
        clearReviews,
        setReviews,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
}
