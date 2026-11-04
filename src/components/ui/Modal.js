"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import Spinner from "./Spinner";

/**
 * Accessible modal dialog (used for bookings, forgot-password and
 * delete confirmations). Closes on Escape / backdrop click.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        className={cn(
          "card sp-fade-up relative max-h-[90vh] w-full overflow-y-auto p-6 shadow-2xl",
          size === "lg" ? "max-w-2xl" : "max-w-md"
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted transition hover:bg-surface-2 hover:text-ink"
        >
          <X size={18} />
        </button>
        {title && (
          <h3 className="pr-8 text-lg font-bold tracking-tight text-ink">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-1.5 pr-8 text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
        <div className={title || description ? "mt-5" : ""}>{children}</div>
      </div>
    </div>,
    document.body
  );
}

/** Confirmation dialog — always used before destructive actions. */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Keep it",
  loading = false,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm leading-relaxed text-muted">{message}</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="btn btn-ghost px-5 py-2.5"
          onClick={onClose}
          disabled={loading}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className="btn btn-danger px-5 py-2.5"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading && <Spinner size={16} />}
          {loading ? "Working…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
