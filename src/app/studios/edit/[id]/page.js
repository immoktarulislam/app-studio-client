"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import StudioForm from "@/components/StudioForm";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { studiosApi } from "@/lib/api";

function EditStudioContent() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [studio, setStudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await studiosApi.get(id);
      if (data.studio.ownerEmail !== user.email) {
        toast.error("You can only edit studios that you own.");
        router.replace("/my-listings");
        return;
      }
      setStudio(data.studio);
    } catch (error) {
      if (error.status === 404) setMissing(true);
      else toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [id, user.email, router]);

  useEffect(() => {
    Promise.resolve().then(load);
  }, [load]);

  if (missing) notFound();

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        href="/my-listings"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-brand"
      >
        <ArrowLeft size={15} /> Back to My Studio Listings
      </Link>

      <span className="section-kicker mt-6 block">Update listing</span>
      <h1 className="section-title mt-2">Edit your studio</h1>
      <p className="section-sub">
        Keep rates, amenities and photos current so creators always see the
        right details.
      </p>

      <div className="mt-8">
        {loading || !studio ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size={26} />
          </div>
        ) : (
          <StudioForm mode="edit" initial={studio} />
        )}
      </div>
    </div>
  );
}

export default function EditStudioPage() {
  return (
    <ProtectedRoute>
      <EditStudioContent />
    </ProtectedRoute>
  );
}
