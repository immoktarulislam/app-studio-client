"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CalendarCheck2, Clock, MapPin, XCircle } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import InvoiceButton from "@/components/InvoiceButton";
import SmartImage from "@/components/SmartImage";
import EmptyState from "@/components/ui/EmptyState";
import { StudiosGridSkeleton } from "@/components/ui/Skeleton";
import { ConfirmModal } from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { bookingsApi } from "@/lib/api";
import {
  cn,
  formatDate,
  formatDuration,
  formatMoney,
  statusBadgeClass,
} from "@/lib/utils";

function BookingsContent() {
  // const { user } = useAuth();
  // const [bookings, setBookings] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [loadError, setLoadError] = useState(null);
  const [pendingCancel, setPendingCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await bookingsApi.mine(user.email);
      setBookings(data.bookings || []);
      setLoadError(null);
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  const retry = () => {
    setLoading(true);
    load();
  };

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  const confirmCancel = async () => {
    if (!pendingCancel) return;
    setCancelling(true);
    try {
      await bookingsApi.cancel(pendingCancel._id);
      toast.success("Booking cancelled. The slot is available again.");
      setPendingCancel(null);
      load();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="section-kicker">Reservations</span>
      <h1 className="section-title mt-2">My Bookings</h1>
      <p className="section-sub">
        {loading
          ? "Fetching your reservations…"
          : `${bookings.length} ${bookings.length === 1 ? "booking" : "bookings"} on your account`}
      </p>

      <div className="mt-8">
        {loading ? (
          <StudiosGridSkeleton count={3} />
        ) : loadError ? (
          <EmptyState
            icon={CalendarCheck2}
            title="We could not load your bookings"
            text={loadError}
            actionLabel="Try again"
            onAction={retry}
          />
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={CalendarCheck2}
            title="No bookings yet"
            text="When you reserve a studio it will show up here with its live status, times and invoice."
            actionLabel="Explore studios"
            actionHref="/studios"
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="card hidden overflow-hidden md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-line bg-surface-2 text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-5 py-3.5 font-bold">Studio</th>
                    <th className="px-5 py-3.5 font-bold">Date & time</th>
                    <th className="px-5 py-3.5 font-bold">Hours</th>
                    <th className="px-5 py-3.5 font-bold">Total</th>
                    <th className="px-5 py-3.5 font-bold">Status</th>
                    <th className="px-5 py-3.5 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="align-middle">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <SmartImage
                            src={booking.studioImage}
                            alt={booking.studioTitle}
                            className="h-12 w-16 shrink-0 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/studios/${booking.studioId}`}
                              className="line-clamp-1 font-bold text-ink hover:text-brand"
                            >
                              {booking.studioTitle}
                            </Link>
                            <p className="flex items-center gap-1 text-xs text-muted">
                              <MapPin size={11} /> {booking.studioLocation}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-ink">
                          {formatDate(booking.date)}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted">
                          <Clock size={11} /> {booking.startTime} –{" "}
                          {booking.endTime}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {formatDuration(booking.hours)}
                      </td>
                      <td className="px-5 py-4 font-bold text-ink">
                        {formatMoney(booking.totalPrice)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            "badge",
                            statusBadgeClass(booking.status)
                          )}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          {["Confirmed", "Completed"].includes(booking.status) && (
                            <InvoiceButton booking={booking} />
                          )}
                          {booking.status === "Pending" && (
                            <button
                              type="button"
                              onClick={() => setPendingCancel(booking)}
                              className="btn btn-ghost btn-sm text-danger"
                            >
                              <XCircle size={14} /> Cancel Booking
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="space-y-4 md:hidden">
              {bookings.map((booking) => (
                <li key={booking._id} className="card p-5">
                  <div className="flex gap-3">
                    <SmartImage
                      src={booking.studioImage}
                      alt={booking.studioTitle}
                      className="h-20 w-24 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/studios/${booking.studioId}`}
                        className="line-clamp-1 font-bold text-ink hover:text-brand"
                      >
                        {booking.studioTitle}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatDate(booking.date)} · {booking.startTime}–
                        {booking.endTime}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">
                        {formatDuration(booking.hours)} ·{" "}
                        {formatMoney(booking.totalPrice)}
                      </p>
                      <span
                        className={cn(
                          "badge mt-2",
                          statusBadgeClass(booking.status)
                        )}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {["Confirmed", "Completed"].includes(booking.status) && (
                      <InvoiceButton booking={booking} />
                    )}
                    {booking.status === "Pending" && (
                      <button
                        type="button"
                        onClick={() => setPendingCancel(booking)}
                        className="btn btn-ghost btn-sm text-danger"
                      >
                        <XCircle size={14} /> Cancel Booking
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <ConfirmModal
        open={Boolean(pendingCancel)}
        onClose={() => !cancelling && setPendingCancel(null)}
        onConfirm={confirmCancel}
        loading={cancelling}
        title="Cancel this booking?"
        message={`Your reservation for "${pendingCancel?.studioTitle}" on ${pendingCancel ? formatDate(pendingCancel.date) : ""} will be cancelled and the slot released to other creators.`}
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
      />
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}
