"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { wishlistApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

/** Heart toggle that saves a studio to the user's MongoDB wishlist. */
export default function WishlistButton({
  studioId,
  saved,
  onChange,
  className,
}) {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!user) {
      toast.info("Log in to save studios to your wishlist.");
      router.push("/login");
      return;
    }
    try {
      const data = await wishlistApi.toggle(studioId);
      toast.success(
        data.added
          ? "Added to your saved studios."
          : "Removed from your saved studios."
      );
      onChange?.(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={saved ? "Remove from saved studios" : "Save to wishlist"}
      aria-pressed={saved}
      className={cn(
        "flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface/90 shadow-md backdrop-blur transition hover:scale-105",
        saved ? "text-rose-500" : "text-muted hover:text-rose-500",
        className
      )}
    >
      <Heart size={17} className={saved ? "fill-rose-500" : ""} />
    </button>
  );
}
