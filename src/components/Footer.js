"use client";

import { useState } from "react";
import Link from "next/link";
import { Aperture, Send } from "lucide-react";
import { CATEGORIES, NAV_LINKS } from "@/lib/constants";
import { toast } from "sonner";

// Read once per environment (build + browser) so prerendering stays deterministic
const CURRENT_YEAR = new Date().getFullYear();

function XLogo({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25h6.826l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramLogo({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeLogo({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function LinkedinLogo({ size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const QUICK_LINKS = [
  ...NAV_LINKS,
  { label: "Add New Studio", href: "/add-studio" },
  { label: "My Bookings", href: "/my-bookings" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (event) => {
    event.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("You're on the list! Studio deals will land in your inbox.");
    setEmail("");
  };

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Brand + mission */}
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-on-brand">
              <Aperture size={20} />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-ink">
              Studio<span className="text-brand">Space</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            StudioSpace is the peer-to-peer marketplace where creators, filmmakers
            and photographers discover, book and host creative spaces — from cyc
            walls and cinema stages to podcast lounges and art workshops.
          </p>
          <div className="mt-5 flex items-center gap-2">
            {[
              { label: "StudioSpace on X", href: "https://x.com", Icon: XLogo },
              {
                label: "StudioSpace on Instagram",
                href: "https://instagram.com",
                Icon: InstagramLogo,
              },
              {
                label: "StudioSpace on YouTube",
                href: "https://youtube.com",
                Icon: YoutubeLogo,
              },
              {
                label: "StudioSpace on LinkedIn",
                href: "https://linkedin.com",
                Icon: LinkedinLogo,
              },
            ].map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition hover:border-brand hover:text-brand"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-muted transition hover:text-brand"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
            Popular Categories
          </h3>
          <ul className="mt-4 space-y-2.5">
            {CATEGORIES.map((category) => (
              <li key={category.name}>
                <Link
                  href={`/studios?category=${encodeURIComponent(category.name)}`}
                  className="text-sm text-muted transition hover:text-brand"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink">
            Stay in the loop
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Monthly drops: new studios, host tips and creator discounts. No spam,
            unsubscribe anytime.
          </p>
          <form onSubmit={handleSubscribe} className="mt-4 flex gap-2">
            <label htmlFor="footer-email" className="sr-only">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@studio.com"
              className="input"
            />
            <button
              type="submit"
              aria-label="Subscribe to the newsletter"
              className="btn btn-primary shrink-0 px-4"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="mt-4 text-xs text-muted">
            © {CURRENT_YEAR} StudioSpace. All rights reserved.
          </p>
          <p className="mt-1 text-xs text-muted">
            By using StudioSpace you agree to our{" "}
            <Link href="/about" className="underline hover:text-brand">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/about" className="underline hover:text-brand">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
