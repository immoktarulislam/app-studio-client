import { Star } from "lucide-react";
import { safeRating } from "@/lib/utils";

/** Star row with an optional numeric label ("4.8" or "New"). */
export default function RatingStars({ value = 0, size = 14, count }) {
  const rating = safeRating(value);
  const full = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= full
                ? "fill-brand text-brand"
                : "fill-line text-line"
            }
          />
        ))}
      </span>
      <span className="text-xs font-semibold text-muted">
        {rating > 0 ? rating.toFixed(1) : "New"}
        {typeof count === "number" ? ` (${count})` : ""}
      </span>
    </span>
  );
}
