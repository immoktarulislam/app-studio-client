"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Aperture, Home, RotateCcw } from "lucide-react";

/** Custom 404 with a studio-flavored illustration and a direct home CTA. */
export default function NotFound() {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      {/* 404 "aperture" illustration */}
      <svg
        width="220"
        height="160"
        viewBox="0 0 220 160"
        fill="none"
        aria-hidden="true"
      >
        <rect x="20" y="30" width="180" height="100" rx="12" className="fill-surface-2 stroke-line" strokeWidth="3" />
        <circle cx="110" cy="80" r="34" className="stroke-brand" strokeWidth="4" />
        <circle cx="110" cy="80" r="14" className="fill-brand" />
        <path d="M110 46 L138 68" className="stroke-brand" strokeWidth="4" strokeLinecap="round" />
        <path d="M42 30 L58 14" className="stroke-line" strokeWidth="4" strokeLinecap="round" />
        <path d="M178 30 L162 14" className="stroke-line" strokeWidth="4" strokeLinecap="round" />
        <rect x="34" y="130" width="152" height="10" rx="5" className="fill-brand/20" />
        <circle cx="38" cy="145" r="7" className="fill-line" />
        <circle cx="182" cy="145" r="7" className="fill-line" />
      </svg>

      <span className="badge badge-brand mt-8">Error 404</span>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        This scene is off the schedule
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
        The page you are looking for was moved, deleted, or never booked into
        the lineup. Let&apos;s get you back to a space that is ready to shoot.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn btn-primary btn-lg">
          <Home size={17} /> Return to Home
        </Link>
        <Link href="/studios" className="btn btn-ghost btn-lg">
          <Aperture size={17} /> Browse Studios
        </Link>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-ghost btn-lg"
        >
          <RotateCcw size={17} /> Go Back
        </button>
      </div>
    </div>
  );
}
