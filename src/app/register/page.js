"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Eye, EyeOff, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import GoogleSignIn from "@/components/GoogleSignIn";
import SmartImage from "@/components/SmartImage";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

function Rule({ ok, label }) {
  return (
    <li className="flex items-center gap-2 text-xs font-medium">
      <span
        className={cn(
          "flex h-4.5 w-4.5 items-center justify-center rounded-full",
          ok ? "bg-success/15 text-success" : "bg-surface-2 text-muted"
        )}
        style={{ width: 18, height: 18 }}
      >
        {ok ? <Check size={11} /> : <X size={11} />}
      </span>
      <span className={ok ? "text-success" : "text-muted"}>{label}</span>
    </li>
  );
}

export default function RegisterPage() {
  const { user, loading, register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    photo: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  const rules = {
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    length: form.password.length >= 6,
  };
  const passwordValid = rules.upper && rules.lower && rules.length;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Please fill in your name and email.");
      return;
    }
    if (!passwordValid) {
      toast.error(
        "Password must contain an uppercase letter, a lowercase letter and be at least 6 characters."
      );
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        photo: form.photo.trim(),
        password: form.password,
      });
      toast.success("Account created! Log in to start booking studios.");
      router.push("/login");
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
    <div className="mx-auto w-full max-w-lg px-4 py-14 sm:px-6">
      <div className="card p-8">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-on-brand shadow-sm shadow-brand/30">
            <UserPlus size={24} />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink">
            Join StudioSpace
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Create a free account to book studios and host your own spaces.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="label" htmlFor="reg-name">
              Name
            </label>
            <input
              id="reg-name"
              className="input"
              placeholder="Alex Rivera"
              value={form.name}
              onChange={setField("name")}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="reg-email">
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              className="input"
              placeholder="you@studio.com"
              value={form.email}
              onChange={setField("email")}
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="reg-photo">
              Photo URL
            </label>
            <div className="flex items-center gap-3">
              {form.photo.trim() && (
                <SmartImage
                  src={form.photo.trim()}
                  alt="Profile preview"
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
              )}
              <input
                id="reg-photo"
                className="input"
                placeholder="https://i.pravatar.cc/150?img=12"
                value={form.photo}
                onChange={setField("photo")}
              />
            </div>
            <p className="hint">Optional — used for your avatar in the navbar.</p>
          </div>

          <div>
            <label className="label" htmlFor="reg-password">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="input pr-11"
                placeholder="••••••••"
                value={form.password}
                onChange={setField("password")}
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
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              <Rule ok={rules.upper} label="Uppercase letter" />
              <Rule ok={rules.lower} label="Lowercase letter" />
              <Rule ok={rules.length} label="6+ characters" />
            </ul>
          </div>

          <div>
            <label className="label" htmlFor="reg-confirm">
              Confirm password
            </label>
            <input
              id="reg-confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className={cn(
                "input",
                form.confirm && form.confirm !== form.password && "input-error"
              )}
              placeholder="••••••••"
              value={form.confirm}
              onChange={setField("confirm")}
              required
            />
            {form.confirm && form.confirm !== form.password && (
              <p className="field-error">Passwords do not match.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full py-3"
          >
            {submitting ? <Spinner size={16} /> : <UserPlus size={16} />}
            {submitting ? "Creating account…" : "Register"}
          </button>
        </form>

        <div className="mt-6">
          <GoogleSignIn onSuccess={() => router.replace("/")} />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
