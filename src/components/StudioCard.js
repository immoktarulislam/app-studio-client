"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import SmartImage from "./SmartImage";
import RatingStars from "./ui/RatingStars";
import WishlistButton from "./WishlistButton";
import { formatRate } from "@/lib/utils";

/** Uniform studio card used on Home, Explore, Wishlist and listings grids. */
export default function StudioCard({ studio, saved = false, onToggleSaved }) {
  return (
    <article className="card group flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-52 w-full overflow-hidden">
        <SmartImage
          src={studio.image}
          alt={studio.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="badge badge-solid absolute left-3 top-3 shadow-md">
          {studio.category}
        </span>
        <WishlistButton
          studioId={studio._id}
          saved={saved}
          onChange={onToggleSaved}
          className="absolute right-3 top-3"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-bold text-ink">
            {studio.title}
          </h3>
          <RatingStars value={studio.rating} />
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={14} className="shrink-0" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-4">
          <p className="text-lg font-extrabold text-ink">
            {formatRate(studio.hourlyRate)}
          </p>
          <Link
            href={`/studios/${studio._id}`}
            className="btn btn-primary btn-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
