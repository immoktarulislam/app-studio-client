"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import StudioForm from "@/components/StudioForm";

function AddStudioContent() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <span className="section-kicker">Host on StudioSpace</span>
      <h1 className="section-title mt-2">Add New Studio</h1>
      <p className="section-sub">
        Describe your creative space, set your rates and publish it to the
        marketplace. You can edit everything later from My Studio Listings.
      </p>
      <div className="mt-8">
        <StudioForm mode="add" />
      </div>
    </div>
  );
}

export default function AddStudioPage() {
  return (
    <ProtectedRoute>
      <AddStudioContent />
    </ProtectedRoute>
  );
}
