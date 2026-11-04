import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  CreditCard,
  KeyRound,
  Search,
  Sparkles,
  Video,
} from "lucide-react";

export const metadata = {
  title: "How It Works",
  description:
    "Learn how StudioSpace works — discover creative spaces, pick your shoot hours, book instantly and produce your best work.",
};

const STEPS = [
  {
    icon: Search,
    title: "Discover Spaces",
    text: "Search the marketplace by category, city, hourly rate and amenities. Every listing shows real photos, host details and creator reviews so you know exactly what you are walking into.",
    tip: "Use category filters like Photo Studio or Podcast Lounge to narrow in fast.",
  },
  {
    icon: CalendarCheck2,
    title: "Select Shoot Hours",
    text: "Open any studio page, hit “Book Workspace Now” and choose your date plus start and end times. Your total — hours × hourly rate — updates live before you confirm anything.",
    tip: "Security deposits are shown upfront and refunded after the session.",
  },
  {
    icon: CreditCard,
    title: "Book Instantly",
    text: "Confirm the reservation and it is saved to My Bookings with a pending status. Our double-booking protection checks the studio's calendar so two creators never collide on the same slot.",
    tip: "Pending slots can be cancelled free of charge until the host confirms.",
  },
  {
    icon: Video,
    title: "Create & Produce",
    text: "Show up at the scheduled time with your team and gear. Verified hosts, platform liability coverage and 24/7 support have your back from call sheet to final export.",
    tip: "Download a PDF invoice for every confirmed booking from My Bookings.",
  },
];

const FAQS = [
  {
    q: "How much does it cost to join StudioSpace?",
    a: "Creating an account and browsing studios is completely free. You only pay the hourly rate of the space you book, plus any refundable security deposit set by the host.",
  },
  {
    q: "Can I list more than one studio?",
    a: "Absolutely. Hosts can publish unlimited listings from the Add New Studio page and manage everything — updates, pricing and deletions — from My Studio Listings.",
  },
  {
    q: "What happens if a time slot is already booked?",
    a: "Our booking system checks the studio's confirmed and pending reservations before saving yours. If your hours overlap, we reject the request with a clear message and suggest picking another slot.",
  },
  {
    q: "Is my payment protected?",
    a: "Yes. Bookings include platform liability protection, and StudioSpace never encourages off-platform payments. If something goes wrong, creator support is available around the clock.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      {/* Header */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <span className="section-kicker">
            <Sparkles size={14} /> How booking works
          </span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            From empty calendar to rolling camera
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            StudioSpace connects creators who need the perfect room with hosts
            who have one. Here is the entire journey, step by step.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const reversed = index % 2 === 1;
            return (
              <div
                key={step.title}
                className={`card grid gap-6 p-8 md:grid-cols-[auto_1fr] ${
                  reversed ? "md:[direction:rtl]" : ""
                }`}
              >
                <div className="flex items-start gap-4 md:[direction:ltr]">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-on-brand shadow-sm shadow-brand/30">
                    <Icon size={24} />
                  </span>
                  <span className="badge badge-brand mt-1">
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="md:[direction:ltr]">
                  <h2 className="text-2xl font-bold tracking-tight text-ink">
                    {step.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {step.text}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand-strong dark:text-brand">
                    <KeyRound size={13} /> {step.tip}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center">Questions, answered</h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="card group p-5">
                <summary className="cursor-pointer list-none text-sm font-bold text-ink marker:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {faq.q}
                    <span className="text-brand transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Ready to book your first space?
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/studios" className="btn btn-primary btn-lg">
            Explore Studios <ArrowRight size={16} />
          </Link>
          <Link href="/register" className="btn btn-ghost btn-lg">
            Create a free account
          </Link>
        </div>
      </section>
    </div>
  );
}
