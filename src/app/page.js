"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  CalendarCheck2,
  Clapperboard,
  Drama,
  Headphones,
  Music,
  Palette,
  Podcast,
  Search,
  ShieldCheck,
  Sparkles,
  Wallet,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import HeroSlider from "@/components/HeroSlider";
import StudioCard from "@/components/StudioCard";
import { StudiosGridSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { studiosApi, wishlistApi } from "@/lib/api";
import {
  BOOKING_STEPS,
  CATEGORIES,
  GUARANTEES,
} from "@/lib/constants";

const CATEGORY_ICONS = {
  Camera,
  Clapperboard,
  Drama,
  Podcast,
  Music,
  Palette,
};

const STEP_ICONS = [Search, CalendarCheck2, Wallet, Sparkles];

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [savedIds, setSavedIds] = useState([]);

  const loadFeatured = useCallback(async () => {
    try {
      const data = await studiosApi.featured();
      setFeatured(data.studios || []);
      setLoadError(null);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const retryFeatured = () => {
    setLoading(true);
    loadFeatured();
  };

  useEffect(() => {
    Promise.resolve().then(loadFeatured);
  }, [loadFeatured]);

  useEffect(() => {
    if (!user) return;
    wishlistApi
      .ids()
      .then((data) => setSavedIds(data.wishlist || []))
      .catch(() => {});
  }, [user]);

  const handleHostClick = (event) => {
    if (!user) {
      event.preventDefault();
      toast.info("Create an account or log in to list your studio.");
      router.push("/add-studio");
    }
  };

  return (
    <div>
      <h1 className="sr-only">
        StudioSpace — book creative studios, sound stages and workshops by the
        hour
      </h1>

      <HeroSlider />

      {/* ---------- Featured studios (dynamic, top-rated) ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-kicker">
              <Sparkles size={14} /> Featured spaces
            </span>
            <h2 className="section-title mt-2">Top-rated studios this week</h2>
            <p className="section-sub">
              Dynamically fetched from our marketplace — the highest rated and
              newest spaces, updated as hosts list them.
            </p>
          </div>
          <Link href="/studios" className="btn btn-ghost">
            Explore all studios <ArrowRight size={15} />
          </Link>
        </div>

        <div className="mt-10">
          {loading ? (
            <StudiosGridSkeleton count={6} />
          ) : loadError ? (
            <EmptyState
              icon={Wallet}
              title="We could not load the featured studios"
              text={loadError}
              actionLabel="Try again"
              onAction={retryFeatured}
            />
          ) : featured.length === 0 ? (
            <EmptyState
              icon={Camera}
              title="No studios listed yet"
              text="Be the first host on StudioSpace — list your creative space and start earning."
              actionLabel="Add your studio"
              actionHref="/add-studio"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((studio) => (
                <StudioCard
                  key={studio._id}
                  studio={studio}
                  saved={savedIds.includes(studio._id)}
                  onToggleSaved={(data) => setSavedIds(data.wishlist)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Browse by category ---------- */}
      <section className="border-y border-line bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="section-kicker">Browse by category</span>
          <h2 className="section-title mt-2">Find your kind of space</h2>
          <p className="section-sub">
            Six creative categories, hundreds of rooms. Pick one and we will
            pre-filter the marketplace for you.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICONS[category.icon] || Camera;
              return (
                <Link
                  key={category.name}
                  href={`/studios?category=${encodeURIComponent(category.name)}`}
                  className="card group relative h-44 overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={category.image}
                    alt={category.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5">
                    <span className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-on-brand">
                      <Icon size={17} />
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {category.name}
                    </h3>
                    <p className="mt-0.5 line-clamp-1 text-sm text-white/75">
                      {category.tagline}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- How booking works ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <span className="section-kicker">How booking works</span>
        <h2 className="section-title mt-2">From search bar to set life in 4 steps</h2>
        <p className="section-sub">
          Booking a studio on StudioSpace takes minutes — transparent pricing,
          no back-and-forth emails.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {BOOKING_STEPS.map((item, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <div key={item.step} className="card relative p-6">
                <span className="absolute -top-3 left-6 badge badge-solid shadow-md">
                  Step {item.step}
                </span>
                <span className="mt-2 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-strong dark:text-brand">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Host guarantee & creator support ---------- */}
      <section className="border-y border-line bg-surface py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="section-kicker">Host guarantee & creator support</span>
          <h2 className="section-title mt-2">Booked spaces, protected shoots</h2>
          <p className="section-sub">
            Every reservation on StudioSpace is backed by platform assurances
            built for creative work.
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GUARANTEES.map((item) => {
              const Icon = {
                ShieldCheck,
                BadgeCheck,
                Wrench,
                Headphones,
              }[item.icon];
              return (
                <div key={item.title} className="card p-6">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-strong dark:text-brand">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-brand/30 blur-3xl"
          />
          <h2 className="relative text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Your next great shoot starts with the right room
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-base text-white/75">
            Browse hundreds of creator-owned studios, or list your own space and
            earn on your schedule.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/studios" className="btn btn-primary btn-lg">
              Explore Studios
            </Link>
            <Link
              href="/add-studio"
              onClick={handleHostClick}
              className="btn btn-lg border border-white/40 bg-white/10 text-white transition hover:bg-white/25"
            >
              Host Your Space
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
