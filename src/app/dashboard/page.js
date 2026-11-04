"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Building2,
  CalendarCheck2,
  Heart,
  MapPin,
  Plus,
  Search,
  Wallet,
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import StudioCard from "@/components/StudioCard";
import SmartImage from "@/components/SmartImage";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { cn, formatDate, formatMoney, statusBadgeClass } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { bookingsApi, studiosApi, wishlistApi } from "@/lib/api";

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong dark:text-brand">
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-extrabold leading-none text-ink">{value}</p>
        <p className="mt-1 truncate text-sm font-semibold text-ink">{label}</p>
        {hint && <p className="truncate text-xs text-muted">{hint}</p>}
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ studios: 0, bookings: 0, pending: 0, saved: 0 });
  const [recentBookings, setRecentBookings] = useState([]);
  const [savedStudios, setSavedStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    const [studiosResult, bookingsResult, wishlistResult] =
      await Promise.allSettled([
        studiosApi.mine(user.email),
        bookingsApi.mine(user.email),
        wishlistApi.studios(),
      ]);

    if (
      studiosResult.status === "rejected" &&
      bookingsResult.status === "rejected"
    ) {
      setError(
        studiosResult.reason?.message ||
          bookingsResult.reason?.message ||
          "We could not load your dashboard."
      );
      setLoading(false);
      return;
    }

    const studios =
      studiosResult.status === "fulfilled" ? studiosResult.value.studios : [];
    const bookings =
      bookingsResult.status === "fulfilled" ? bookingsResult.value.bookings : [];
    const saved =
      wishlistResult.status === "fulfilled" ? wishlistResult.value.studios : [];

    setStats({
      studios: studios.length,
      bookings: bookings.length,
      pending: bookings.filter((booking) => booking.status === "Pending").length,
      saved: saved.length,
    });
    setRecentBookings(bookings.slice(0, 4));
    setSavedStudios(saved.slice(0, 3));
    setError(null);
    setLoading(false);
  }, [user.email]);

  const retry = () => {
    setLoading(true);
    setError(null);
    load();
  };

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={Wallet}
          title="We could not load your dashboard"
          text={error}
          actionLabel="Try again"
          onAction={retry}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Welcome banner */}
      <div className="card flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <SmartImage
            src={user.photo}
            alt={user.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Dashboard
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight text-ink">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-sm text-muted">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/add-studio" className="btn btn-primary">
            <Plus size={16} /> Add New Studio
          </Link>
          <Link href="/studios" className="btn btn-ghost">
            <Search size={16} /> Explore
          </Link>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="mt-6 flex items-center justify-center py-16">
          <Spinner size={26} />
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Building2}
              value={stats.studios}
              label={stats.studios === 1 ? "Studio listed" : "Studios listed"}
              hint="Your published spaces"
            />
            <StatCard
              icon={CalendarCheck2}
              value={stats.bookings}
              label={stats.bookings === 1 ? "Booking made" : "Bookings made"}
              hint="Reservations you requested"
            />
            <StatCard
              icon={Wallet}
              value={stats.pending}
              label="Pending bookings"
              hint="Awaiting confirmation"
            />
            <StatCard
              icon={Heart}
              value={stats.saved}
              label="Saved studios"
              hint="Your wishlist"
            />
          </div>

          {/* Recent bookings + saved studios */}
          <div className="mt-8 grid gap-8 lg:grid-cols-5">
            <section className="lg:col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink">Recent bookings</h2>
                <Link
                  href="/my-bookings"
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  View all
                </Link>
              </div>

              {recentBookings.length === 0 ? (
                <div className="card mt-4 p-8 text-center">
                  <p className="text-sm font-semibold text-ink">
                    No bookings yet
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Reserve your first creative space and it will appear here.
                  </p>
                  <Link href="/studios" className="btn btn-primary mt-5">
                    Explore studios
                  </Link>
                </div>
              ) : (
                <ul className="card mt-4 divide-y divide-line">
                  {recentBookings.map((booking) => (
                    <li
                      key={booking._id}
                      className="flex items-center gap-3 p-4"
                    >
                      <SmartImage
                        src={booking.studioImage}
                        alt={booking.studioTitle}
                        className="h-12 w-16 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink">
                          {booking.studioTitle}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {formatDate(booking.date)} · {booking.startTime}–
                          {booking.endTime}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted">
                          <MapPin size={11} /> {booking.studioLocation}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-ink">
                          {formatMoney(booking.totalPrice)}
                        </p>
                        <span
                          className={cn(
                            "badge mt-1",
                            statusBadgeClass(booking.status)
                          )}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-ink">Saved studios</h2>
                <Link
                  href="/studios"
                  className="text-sm font-semibold text-brand hover:underline"
                >
                  Find more
                </Link>
              </div>

              {savedStudios.length === 0 ? (
                <div className="card mt-4 p-8 text-center">
                  <p className="text-sm font-semibold text-ink">
                    Your wishlist is empty
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Tap the heart on any studio card to save it here.
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid gap-4">
                  {savedStudios.map((studio) => (
                    <Link
                      key={studio._id}
                      href={`/studios/${studio._id}`}
                      className="card group flex items-center gap-3 p-3 transition hover:border-brand"
                    >
                      <SmartImage
                        src={studio.image}
                        alt={studio.title}
                        className="h-16 w-24 shrink-0 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">
                          {studio.title}
                        </p>
                        <p className="truncate text-xs text-muted">
                          {studio.category} · {studio.location}
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-brand">
                          ${studio.hourlyRate}/hr
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
