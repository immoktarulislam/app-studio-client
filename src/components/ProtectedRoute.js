"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PageSkeleton from "./ui/Skeleton";

/**
 * Client-side guard for private routes. Waits for the auth check,
 * then redirects anonymous visitors to /login with a `next` param
 * so they land back where they intended after logging in.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const path =
        typeof window !== "undefined" ? window.location.pathname : "/dashboard";
      router.replace(`/login?next=${encodeURIComponent(path)}`);
    }
  }, [loading, user, router]);

  if (loading || !user) return <PageSkeleton />;

  return children;
}
