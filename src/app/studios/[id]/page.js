"use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import Link from "next/link";
// import { notFound, useParams, useRouter } from "next/navigation";
// import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  CalendarPlus,
  Check,
  MapPin,
  Maximize2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import SmartImage from "@/components/SmartImage";
import BookingModal from "@/components/BookingModal";
import WishlistButton from "@/components/WishlistButton";
import RatingStars from "@/components/ui/RatingStars";
import EmptyState from "@/components/ui/EmptyState";
import PageSkeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { studiosApi, wishlistApi } from "@/lib/api";
import { formatDate, formatMoney, formatRate, safeRating } from "@/lib/utils";

function avatarUrl(seed = "") {
  const number = (seed.split("").reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 70) + 1;
  return `https://i.pravatar.cc/100?img=${number}`;
}

export default function StudioDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const loadStudio = useCallback(async () => {
    try {
      const data = await studiosApi.get(id);
      setStudio(data.studio);
    } catch (error) {
      if (error.status === 404) setMissing(true);
      else toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(loadStudio);
  }, [loadStudio]);

  useEffect(() => {
    if (!user) return;
    wishlistApi
      .ids()
      .then((data) => setSaved((data.wishlist || []).includes(id)))
      .catch(() => { });
  }, [user, id]);

  const gallery = useMemo(() => {
    if (!studio) return [];
    const images = [studio.image, ...(studio.gallery || [])].filter(Boolean);
    return [...new Set(images)];
  }, [studio]);

  if (missing) notFound();

  if (loading || !studio) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="skeleton h-6 w-40" />
        <div className="skeleton mt-6 h-96 w-full" />
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="skeleton h-8 w-2/3" />
            <div className="skeleton h-32 w-full" />
            <div className="skeleton h-48 w-full" />
          </div>
          <div className="skeleton h-72 w-full" />
        </div>
      </div>
    );
  }

  const specs = [
    { icon: Banknote, label: "Hourly rate", value: formatRate(studio.hourlyRate) },
    { icon: Maximize2, label: "Security deposit", value: formatMoney(studio.securityDeposit) },
    { icon: Users, label: "Max capacity", value: `${studio.maxCapacity} people` },
    { icon: MapPin, label: "Location", value: studio.location },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/studios"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-brand"
      >
        <ArrowLeft size={15} /> Back to Explore Studios
      </Link>

      {/* Gallery */}
      <div className="relative mt-5 h-72 overflow-hidden rounded-3xl sm:h-[26rem]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={gallery.length > 1}
          className="h-full w-full"
          style={{ "--swiper-navigation-color": "#fff" }}
        >
          {gallery.map((image, index) => (
            <SwiperSlide key={`${image}-${index}`}>
              <SmartImage
                src={image}
                alt={`${studio.title} — photo ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <span className="badge badge-solid absolute left-4 top-4 shadow-md">
          {studio.category}
        </span>
        <WishlistButton
          studioId={studio._id}
          saved={saved}
          onChange={(data) => setSaved(data.added)}
          className="absolute right-4 top-4"
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-8 lg:col-span-2">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <RatingStars value={studio.rating} count={studio.reviews?.length} />
              <span className="badge badge-muted">
                {studio.reviews?.length || 0} reviews
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              {studio.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted">
              <MapPin size={16} /> {studio.location}
            </p>
          </div>

          {/* Specs */}
          <div className="grid gap-4 sm:grid-cols-2">
            {specs.map(({ icon: Icon, label, value }) => (
              <div key={label} className="card flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong dark:text-brand">
                  <Icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted">
                    {label}
                  </p>
                  <p className="truncate text-sm font-bold text-ink">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Overview */}
          <section className="card p-6">
            <h2 className="text-lg font-bold text-ink">About this space</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted whitespace-pre-line">
              {studio.overview}
            </p>
          </section>

          {/* Amenities */}
          {studio.amenities?.length > 0 && (
            <section className="card p-6">
              <h2 className="text-lg font-bold text-ink">Amenities</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {studio.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="flex items-center gap-2.5 text-sm text-ink"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-soft text-brand-strong dark:text-brand">
                      <Check size={13} />
                    </span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Host */}
          <section className="card p-6">
            <h2 className="text-lg font-bold text-ink">Hosted by</h2>
            <div className="mt-4 flex items-center gap-4">
              <SmartImage
                src={avatarUrl(studio.ownerEmail)}
                alt={studio.ownerName}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <p className="flex items-center gap-1.5 font-bold text-ink">
                  {studio.ownerName}
                  <BadgeCheck size={16} className="text-brand" />
                </p>
                <p className="text-sm text-muted">{studio.ownerEmail}</p>
                <p className="mt-0.5 text-xs text-muted">
                  Host on StudioSpace · Listed {formatDate(studio.createdAt)}
                </p>
              </div>
            </div>
          </section>

          {/* Reviews */}
          <section className="card p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-ink">Creator reviews</h2>
              <span className="text-sm font-semibold text-muted">
                {safeRating(studio.rating).toFixed(1)} average
              </span>
            </div>
            {studio.reviews?.length ? (
              <ul className="mt-5 space-y-5">
                {studio.reviews.map((review, index) => (
                  <li key={`${review.name}-${index}`} className="flex gap-3.5">
                    <SmartImage
                      src={review.avatar || avatarUrl(review.name)}
                      alt={review.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-ink">
                          {review.name}
                        </p>
                        <RatingStars value={review.rating} size={12} showValue={false} />
                        <span className="text-xs text-muted">
                          {formatDate(review.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {review.comment}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                No reviews yet — be the first creator to book this space.
              </p>
            )}
          </section>
        </div>

        {/* Booking card */}
        <aside>
          <div className="card sticky top-24 p-6">
            <p className="text-3xl font-extrabold text-ink">
              {formatRate(studio.hourlyRate)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {formatMoney(studio.securityDeposit)} refundable deposit ·
              Instant booking
            </p>

            <button
              type="button"
              onClick={() => {
                if (!user) {
                  toast.info("Please log in to book this studio.");
                  router.push(`/login?next=/studios/${studio._id}`);
                  return;
                }
                setBookingOpen(true);
              }}
              className="btn btn-primary btn-lg mt-6 w-full"
            >
              <CalendarPlus size={17} /> Book Workspace Now
            </button>

            <Link
              href="/studios"
              className="btn btn-ghost mt-3 w-full py-3"
            >
              Browse similar spaces
            </Link>

            <ul className="mt-6 space-y-2.5 border-t border-line pt-5 text-xs text-muted">
              <li>Free cancellation until the host confirms your slot.</li>
              <li>Bookings are protected by the StudioSpace guarantee.</li>
              <li>Never transfer payment outside the platform.</li>
            </ul>
          </div>
        </aside>
      </div>

      <BookingModal
        studio={studio}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
