"use client";

// import Link from "next/link";
// import { RefreshCw } from "lucide-react";

/** Route error boundary — shown if a page fails to render. */
export default function Error({ error, reset }) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
        <RefreshCw size={24} />
      </div>
      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-ink">
        Something went wrong on set
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted">
        {error?.message?.includes("unreachable") || error?.message?.includes("server")
          ? error.message
          : "An unexpected error occurred while rendering this page. Your data is safe — try again in a moment."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary btn-lg">
          <RefreshCw size={16} /> Try again
        </button>
        <Link href="/" className="btn btn-ghost btn-lg">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
