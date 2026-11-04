"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const GSI_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

/**
 * "Continue with Google" button backed by Google Identity Services.
 * The resulting ID token is verified server-side by the Express API,
 * which then sets the HTTPOnly session cookie.
 */
export default function GoogleSignIn({ onSuccess }) {
  const { googleSignIn } = useAuth();
  const buttonRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return undefined;

    const existing = document.querySelector(`script[src="${GSI_SRC}"]`);
    const markReady = () => setScriptReady(true);

    if (existing) {
      existing.addEventListener("load", markReady);
      if (window.google) markReady();
      return () => existing.removeEventListener("load", markReady);
    }

    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = markReady;
    document.head.appendChild(script);
    return () => {
      script.onload = null;
    };
  }, []);

  useEffect(() => {
    if (!scriptReady || !CLIENT_ID || !buttonRef.current || !window.google) {
      return undefined;
    }
    try {
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response) => {
          setBusy(true);
          try {
            const data = await googleSignIn(response.credential);
            toast.success(`Welcome, ${data.user.name}!`);
            onSuccess?.();
          } catch (error) {
            toast.error(error.message);
          } finally {
            setBusy(false);
          }
        },
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "continue_with",
      });
    } catch {
      // Scheduled rather than synchronous — satisfies the compiler's effect rule.
      const fail = setTimeout(() => setBlocked(true), 0);
      return () => clearTimeout(fail);
    }

    // Google rejects unlisted origins with a 403 and leaves a 0×0 iframe behind.
    // Detect that shortly after render so we can swap in a helpful fallback.
    const probe = setTimeout(() => {
      const frame = buttonRef.current?.querySelector("iframe");
      const box = frame?.getBoundingClientRect();
      if (!frame || !box || box.width < 10 || box.height < 10) setBlocked(true);
    }, 2500);
    return () => clearTimeout(probe);
  }, [scriptReady, googleSignIn, onSuccess]);

  if (!CLIENT_ID || blocked) {
    const hint =
      typeof window !== "undefined" && window.location.origin
        ? window.location.origin
        : "http://localhost:3000";
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-line" />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            or
          </span>
          <span className="h-px flex-1 bg-line" />
        </div>
        <button
          type="button"
          onClick={() =>
            toast.info(
              CLIENT_ID
                ? `Google sign-in is blocked: "${hint}" is not an authorised origin for this client ID. Add it in Google Cloud Console → Credentials → your OAuth client → Authorized JavaScript origins, or use email & password.`
                : "Google sign-in is not configured yet. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID, or continue with email & password."
            )
          }
          className="btn btn-ghost w-full py-3"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted">
          or
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>
      {busy && (
        <p className="text-center text-sm font-medium text-muted">
          Completing Google sign-in…
        </p>
      )}
      <div className="flex justify-center">
        <div ref={buttonRef} />
      </div>
    </div>
  );
}
