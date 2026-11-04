"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

// Detects when the component has mounted on the client (SSR snapshot: false)
const emptySubscribe = () => () => {};

/** Light ⇄ dark toggle (Challenge 3: theme customization). */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Render a neutral placeholder until mounted to avoid a hydration mismatch
  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-surface text-ink transition hover:border-brand hover:text-brand"
    >
      {isDark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
