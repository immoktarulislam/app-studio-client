"use client";

// import { Suspense, useEffect, useState } from "react";
// import Link from "next/link";
// import { useSearchParams, useRouter } from "next/navigation";
import { Aperture, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import GoogleSignIn from "@/components/GoogleSignIn";
import ForgotPasswordModal from "@/components/ForgotPasswordModal";
import Spinner from "@/components/ui/Spinner";

function LoginForm() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  // Already signed in? Skip the form entirely.
  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [loading, user, next, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password to continue.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back to StudioSpace!");
      router.replace(next);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={26} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14 sm:px-6">
      <div className="card p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-on-brand shadow-sm shadow-brand/30">
            <Aperture size={24} />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Log in to manage your studios and bookings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              className="input"
              placeholder="you@studio.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="label mb-0" htmlFor="login-password">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-xs font-semibold text-brand hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative mt-1.5">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                className="input pr-11"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-ink"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full py-3"
          >
            {submitting ? <Spinner size={16} /> : <LogIn size={16} />}
            {submitting ? "Logging in…" : "Log in"}
          </button>
        </form>

        <div className="mt-6">
          <GoogleSignIn onSuccess={() => router.replace(next)} />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          New to StudioSpace?{" "}
          <Link
            href="/register"
            className="font-semibold text-brand hover:underline"
          >
            Create an account
          </Link>
        </p>

        <div className="mt-6 rounded-xl border border-line bg-surface-2 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            Examiner test account
          </p>
          <p className="mt-1.5 font-mono text-xs text-ink">
            sarah@studiospace.io · Demo1234
          </p>
        </div>
      </div>

      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size={26} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
