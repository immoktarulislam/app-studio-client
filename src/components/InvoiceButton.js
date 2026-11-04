"use client";

import { jsPDF } from "jspdf";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatDuration, formatMoney } from "@/lib/utils";

/**
 * Optional requirement: generates a downloadable PDF invoice for a
 * confirmed studio booking (StudioSpace letterhead + line items).
 */
export default function InvoiceButton({ booking, className }) {
  const generate = () => {
    try {
      const doc = new jsPDF();
      const reference = `#${String(booking._id).slice(-8).toUpperCase()}`;

      // Letterhead
      doc.setFillColor(217, 119, 6);
      doc.rect(0, 0, 210, 34, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("StudioSpace", 16, 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Creative spaces, booked by the hour", 16, 24);
      doc.setFontSize(11);
      doc.text("BOOKING INVOICE", 194, 14, { align: "right" });
      doc.text(`Ref ${reference}`, 194, 21, { align: "right" });

      // Billed to / studio
      doc.setTextColor(28, 25, 23);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Billed to", 16, 50);
      doc.text("Studio", 120, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text([booking.userName || "Creator", booking.userEmail || ""], 16, 58);
      doc.text(
        [booking.studioTitle || "Studio booking", booking.studioLocation || ""],
        120,
        58
      );

      // Line items
      let y = 78;
      doc.setDrawColor(231, 229, 228);
      doc.setFont("helvetica", "bold");
      doc.text("Description", 16, y);
      doc.text("Details", 110, y);
      doc.text("Amount", 194, y, { align: "right" });
      y += 4;
      doc.line(16, y, 194, y);
      y += 8;

      const rows = [
        ["Studio reservation", formatDate(booking.date)],
        ["Time slot", `${booking.startTime} – ${booking.endTime}`],
        ["Duration", formatDuration(booking.hours)],
        ["Status", booking.status],
      ];
      doc.setFont("helvetica", "normal");
      rows.forEach(([label, value]) => {
        doc.text(label, 16, y);
        doc.text(String(value), 110, y);
        doc.text("—", 194, y, { align: "right" });
        y += 8;
      });

      y += 2;
      doc.line(16, y, 194, y);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Total paid", 16, y);
      doc.text(formatMoney(booking.totalPrice), 194, y, { align: "right" });

      // Footer note
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(120, 113, 108);
      doc.text(
        "Thank you for creating with StudioSpace. This invoice was generated automatically for your booking records.",
        16,
        285
      );

      doc.save(`studiospace-invoice-${reference.slice(1)}.pdf`);
      toast.success("Invoice downloaded to your device.");
    } catch {
      toast.error("We could not generate the invoice. Please try again.");
    }
  };

  return (
    <button
      type="button"
      onClick={generate}
      className={`btn btn-ghost btn-sm ${className || ""}`}
    >
      <Download size={14} />
      Invoice
    </button>
  );
}
