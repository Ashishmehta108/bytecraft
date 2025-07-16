"use client";
import { useState } from "react";
import {
  Star,
  MessageSquare,
  Loader2,
  Check,
  Cross,
  CheckCircle,
  CheckCircle2,
  X,
  XCircle,
} from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useReviews } from "./Reviewcontext";
import { toast } from "sonner";

export default function CreateReview() {
  const { id, refreshReviews } = useReviews();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) {
      alert("Please complete all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reviews/createreview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment,
          rating,
          productId: id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create review");
      }

      const newReview = await response.json();
      console.log("Created review:", newReview);
      toast(
        <span className="flex items-center gap-2 ">
          <CheckCircle2 className="fill-green-600  text-white" />
          New review create successfully
        </span>
      );
      setRating(0);
      setComment("");

      await refreshReviews();
    } catch (error: any) {
      console.error("Error creating review:", error);
      toast(
        <span className="flex items-center gap-2 ">
          <XCircle className="fill-red-600  text-white" />
          Could'nt create review try again!
        </span>
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md md:translate-x-[-28%] mt-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6">
      <div className="flex items-center justify-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Write a Review
        </h3>
      </div>

      {/* Star Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
          How would you rate this product?
        </label>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={28}
              className={`cursor-pointer transition-all duration-200 ${
                star <= (hover || rating)
                  ? "text-yellow-400 fill-yellow-400 scale-110"
                  : "text-neutral-300 dark:text-neutral-600 hover:text-yellow-300 hover:scale-105"
              }`}
              onClick={() => {
                console.log(rating);
                setRating(star);
              }}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>
        {rating > 0 && (
          <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            You rated this {rating} out of 5 stars
          </p>
        )}
      </div>

      {/* Comment Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          Share your experience
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell others what you think about this product..."
          maxLength={300}
          rows={4}
          className="w-full border-neutral-300 dark:border-neutral-600 focus:border-neutral-500 dark:focus:border-neutral-400 focus:ring-neutral-500 dark:focus:ring-neutral-400 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {comment.length}/300 characters
          </span>
          {rating > 0 && (
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                {rating}/5
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!rating || !comment.trim() || isSubmitting}
        className="w-full bg-indigo-600  text-white  hover:bg-indigo-700  disabled:bg-indigo-300 dark:disabled:bg-indigo-600 disabled:text-black  dark:disabled:text-neutral-100 cursor-pointer font-medium transition-colors duration-200 h-11"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </div>
  );
}
