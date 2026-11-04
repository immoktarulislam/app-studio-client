"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarClock, Clock } from "lucide-react";
import Modal from "./ui/Modal";
import Spinner from "./ui/Spinner";
import SmartImage from "./SmartImage";
import { useAuth } from "@/context/AuthContext";
import { bookingsApi } from "@/lib/api";
import { formatMoney, hoursBetween, todayISO } from "@/lib/utils";

/**
 * Inner form mounts fresh on every open, so the date/time state is
 * always re-initialized without needing a reset effect.
 */
function BookingForm({ studio, onClose }) {
  const { user } = useAuth();
  const router = useRouter();
  const [date, setDate] = useState(todayISO());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("13:00");
  const [submitting, setSubmitting] = useState(false);

  const hours = useMemo(
    () => hoursBetween(startTime, endTime),
    [startTime, endTime]
  );
  const total = useMemo(
    () => hours * (Number(studio?.hourlyRate) || 0),
    [hours, studio]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      toast.info("Please log in to book this studio.");
      onClose();
      router.push("/login");
      return;
    }
    if (!date) {
      toast.error("Please pick a date for your session.");
      return;
    }
    if (endTime <= startTime) {
      toast.error("End time must be after the start time.");
      return;
    }
    setSubmitting(true);
    try {
      await bookingsApi.create({
        studioId: studio._id,
        date,
        startTime,
        endTime,
      });
      toast.success("Booking requested! It is pending confirmation.");
      onClose();
      router.push("/my-bookings");
    } catch (error) {
      // 409 from the server = double-booking collision
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-3">
        <SmartImage
          src={studio?.image}
          alt={studio?.title || "Studio"}
          className="h-14 w-20 shrink-0 rounded-lg object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-ink">{studio?.title}</p>
          <p className="text-xs text-muted">
            {studio?.location} · {formatMoney(studio?.hourlyRate)}/hr
          </p>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="booking-date">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock size={14} /> Date
          </span>
        </label>
        <input
          id="booking-date"
          type="date"
          className="input"
          value={date}
          min={todayISO()}
          onChange={(event) => setDate(event.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="booking-start">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} /> Start time
            </span>
          </label>
          <input
            id="booking-start"
            type="time"
            className="input"
            value={startTime}
            step={1800}
            onChange={(event) => setStartTime(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="booking-end">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} /> End time
            </span>
          </label>
          <input
            id="booking-end"
            type="time"
            className="input"
            value={endTime}
            step={1800}
            onChange={(event) => setEndTime(event.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-line bg-surface-2 p-4 text-sm">
        <div className="flex justify-between text-muted">
          <span>Hourly rate</span>
          <span className="font-semibold text-ink">
            {formatMoney(studio?.hourlyRate)}/hr
          </span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Duration</span>
          <span className="font-semibold text-ink">
            {hours} {hours === 1 ? "hour" : "hours"}
          </span>
        </div>
        <div className="flex justify-between border-t border-line pt-2 text-base font-bold text-ink">
          <span>Estimated total</span>
          <span>{formatMoney(total)}</span>
        </div>
        <p className="text-xs text-muted">
          A {formatMoney(studio?.securityDeposit)} refundable security deposit
          is handled by the host at check-in.
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn btn-primary w-full py-3"
      >
        {submitting && <Spinner size={16} />}
        {submitting ? "Reserving…" : "Confirm Booking"}
      </button>
    </form>
  );
}

/**
 * Booking dialog for a studio. Computes hours + total live and posts the
 * reservation (the server re-validates and blocks double-bookings).
 */
export default function BookingModal({ studio, open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Book this workspace"
      description="Pick your shoot hours — the total updates instantly."
    >
      {open && <BookingForm studio={studio} onClose={onClose} />}
    </Modal>
  );
}
