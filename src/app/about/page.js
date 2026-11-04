import Link from "next/link";
import {
  ArrowRight,
  Camera,
  HeartHandshake,
  MapPinned,
  ShieldCheck,
  Users,
} from "lucide-react";

export const metadata = {
  title: "About Us",
  description:
    "StudioSpace is a peer-to-peer marketplace built by creators, for creators — making creative spaces easier to book, host and trust.",
};

const VALUES = [
  {
    icon: Camera,
    title: "Creators first",
    text: "Every decision starts with the people who book and host spaces — clear pricing, honest photos and zero hidden fees.",
  },
  {
    icon: ShieldCheck,
    title: "Trust by design",
    text: "Verified profiles, protected bookings and transparent reviews keep the marketplace safe for everyone involved.",
  },
  {
    icon: HeartHandshake,
    title: "Community over gatekeeping",
    text: "Empty studios and hungry creators should find each other easily. We remove the middlemen, not the standards.",
  },
  {
    icon: Users,
    title: "Made with hosts",
    text: "Our listing tools, calendars and payout flows are shaped in direct feedback sessions with working studio owners.",
  },
];

const NUMBERS = [
  { value: "6", label: "Creative studio categories" },
  { value: "Real-time", label: "Availability & booking" },
  { value: "24/7", label: "Creator support" },
  { value: "0%", label: "Listing fees for hosts" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <span className="section-kicker">About StudioSpace</span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Creative spaces should be as easy to book as a coffee table
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            StudioSpace is a high-performance peer-to-peer marketplace designed
            for creators, filmmakers, photographers, podcasters and musicians —
            connecting the people who need great rooms with the people who have
            them.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h2 className="section-title">Our story</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            StudioSpace started when a group of filmmakers realized they were
            spending more time chasing studio availability over email than
            actually shooting. Meanwhile, incredible spaces — cyc walls, sound
            stages, podcast lounges — sat empty between commercial jobs.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            We built the marketplace we wanted to use: dynamic availability,
            transparent hourly pricing, instant booking management and a
            community of hosts who care about creative work. Today, every listing
            — from a compact podcast booth to a full cinema sound stage — lives
            in one searchable, trustworthy directory.
          </p>
        </div>
        <div className="card p-8">
          <h3 className="text-lg font-bold text-ink">What you can do here</h3>
          <ul className="mt-5 space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <MapPinned size={18} className="mt-0.5 shrink-0 text-brand" />
              Discover studios in your city, filtered by category, price,
              capacity and amenities.
            </li>
            <li className="flex gap-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand" />
              Book with confidence — double-booking protection, protected
              reservations and verified host profiles.
            </li>
            <li className="flex gap-3">
              <Users size={18} className="mt-0.5 shrink-0 text-brand" />
              Host your own space, set your rates and calendar, and earn from
              equipment that is already collecting dust.
            </li>
            <li className="flex gap-3">
              <HeartHandshake size={18} className="mt-0.5 shrink-0 text-brand" />
              Join a community where creators recommend the rooms that made
              their projects shine.
            </li>
          </ul>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-y border-line bg-surface py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {NUMBERS.map((item) => (
            <div key={item.label} className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-brand">
                {item.value}
              </p>
              <p className="mt-1 text-sm font-semibold text-ink">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="section-title">What we stand for</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="card p-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand-strong dark:text-brand">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {value.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 pb-16 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-ink">
          Come build the directory with us
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/studios" className="btn btn-primary btn-lg">
            Explore Studios <ArrowRight size={16} />
          </Link>
          <Link href="/add-studio" className="btn btn-ghost btn-lg">
            List your space
          </Link>
        </div>
      </section>
    </div>
  );
}
