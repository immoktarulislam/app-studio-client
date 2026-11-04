"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { studiosApi } from "@/lib/api";
import { AMENITIES, CATEGORY_NAMES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Spinner from "./ui/Spinner";
import SmartImage from "./SmartImage";

const IMGBB_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

/**
 * Shared form for Add New Studio and Update Studio.
 * Host identity fields (name + email) are read-only.
 */
export default function StudioForm({ mode = "add", initial = null }) {
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: initial?.title || "",
    category: initial?.category || CATEGORY_NAMES[0],
    hourlyRate: initial?.hourlyRate ?? "",
    securityDeposit: initial?.securityDeposit ?? "",
    maxCapacity: initial?.maxCapacity ?? "",
    location: initial?.location || "",
    image: initial?.image || "",
    overview: initial?.overview || "",
  });
  const [amenities, setAmenities] = useState(
    () => new Set(initial?.amenities || [])
  );
  const [galleryText, setGalleryText] = useState(
    (initial?.gallery || []).join("\n")
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const toggleAmenity = (name) =>
    setAmenities((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!IMGBB_KEY) {
      toast.error(
        "Direct uploads need an imgbb API key. Paste an image URL instead, or set NEXT_PUBLIC_IMGBB_API_KEY in your environment."
      );
      event.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`,
        { method: "POST", body: data }
      );
      const result = await response.json();
      if (!response.ok || !result?.data?.url) {
        throw new Error(result?.error?.message || "Upload failed. Try again.");
      }
      setForm((prev) => ({ ...prev, image: result.data.url }));
      toast.success("Image uploaded and attached to the listing.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.title.trim().length < 5) {
      toast.error("Give your studio a descriptive title (at least 5 characters).");
      return;
    }
    if (!form.location.trim()) {
      toast.error("Add the city or address of your studio.");
      return;
    }
    if (!(Number(form.hourlyRate) > 0)) {
      toast.error("Hourly rate must be greater than zero.");
      return;
    }
    if (!form.image.trim()) {
      toast.error("Add an image URL or upload a photo for your listing.");
      return;
    }
    if (form.overview.trim().length < 20) {
      toast.error("Write at least a couple of sentences for the overview.");
      return;
    }
    if (amenities.length === 0) {
      toast.error("Pick at least one amenity so guests know what's included.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      category: form.category,
      hourlyRate: Number(form.hourlyRate),
      securityDeposit: Number(form.securityDeposit) || 0,
      maxCapacity: Number(form.maxCapacity) || 1,
      location: form.location.trim(),
      image: form.image.trim(),
      gallery: galleryText
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      amenities: [...amenities],
      overview: form.overview.trim(),
    };

    setSaving(true);
    try {
      if (mode === "edit") {
        await studiosApi.update(initial._id, payload);
        toast.success("Studio updated successfully.");
      } else {
        await studiosApi.create(payload);
        toast.success("Studio listed! It is live on StudioSpace.");
      }
      router.push("/my-listings");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basics */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-ink">Studio basics</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="label" htmlFor="studio-title">
              Title
            </label>
            <input
              id="studio-title"
              className="input"
              placeholder="e.g. Golden Hour Photo Loft"
              value={form.title}
              onChange={setField("title")}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="studio-category">
              Category
            </label>
            <select
              id="studio-category"
              className="input"
              value={form.category}
              onChange={setField("category")}
            >
              {CATEGORY_NAMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="studio-location">
              Location / Address
            </label>
            <input
              id="studio-location"
              className="input"
              placeholder="e.g. Williamsburg, Brooklyn, NY"
              value={form.location}
              onChange={setField("location")}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="studio-rate">
              Hourly Rate ($)
            </label>
            <input
              id="studio-rate"
              type="number"
              min="1"
              className="input"
              placeholder="85"
              value={form.hourlyRate}
              onChange={setField("hourlyRate")}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="studio-deposit">
              Security Deposit ($)
            </label>
            <input
              id="studio-deposit"
              type="number"
              min="0"
              className="input"
              placeholder="250"
              value={form.securityDeposit}
              onChange={setField("securityDeposit")}
            />
          </div>
          <div>
            <label className="label" htmlFor="studio-capacity">
              Max Capacity
            </label>
            <input
              id="studio-capacity"
              type="number"
              min="1"
              className="input"
              placeholder="12"
              value={form.maxCapacity}
              onChange={setField("maxCapacity")}
            />
          </div>
          <div>
            <label className="label" htmlFor="studio-email">
              Host Email
            </label>
            <input
              id="studio-email"
              className="input cursor-not-allowed opacity-70"
              value={user?.email || ""}
              readOnly
              disabled
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label" htmlFor="studio-name">
              Host Name
            </label>
            <input
              id="studio-name"
              className="input cursor-not-allowed opacity-70"
              value={user?.name || ""}
              readOnly
              disabled
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-ink">Photos</h2>
        <div className="mt-5 space-y-5">
          <div>
            <label className="label" htmlFor="studio-image">
              Cover Image URL
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="studio-image"
                className="input"
                placeholder="https://images.unsplash.com/…"
                value={form.image}
                onChange={setField("image")}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="btn btn-ghost shrink-0 px-5 py-2.5"
              >
                {uploading ? <Spinner size={16} /> : <Upload size={16} />}
                {uploading ? "Uploading…" : "Upload (imgbb)"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
              />
            </div>
            <p className="hint">
              Paste any image URL, or upload a photo directly with your free
              imgbb API key.
            </p>
          </div>

          {form.image && (
            <div className="relative h-52 w-full overflow-hidden rounded-xl border border-line">
              <SmartImage
                src={form.image}
                alt="Studio cover preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div>
            <label className="label" htmlFor="studio-gallery">
              Additional Images (optional)
            </label>
            <textarea
              id="studio-gallery"
              rows={3}
              className="input resize-y"
              placeholder={"One image URL per line"}
              value={galleryText}
              onChange={(event) => setGalleryText(event.target.value)}
            />
            <p className="hint">
              These power the gallery carousel on your studio page.
            </p>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-ink">Amenities</h2>
        <p className="mt-1 text-sm text-muted">
          Select everything your space offers — pick at least one.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {AMENITIES.map((name) => {
            const selected = amenities.has(name);
            return (
              <button
                type="button"
                key={name}
                onClick={() => toggleAmenity(name)}
                aria-pressed={selected}
                className={cn(
                  "cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                  selected
                    ? "border-brand bg-brand text-on-brand"
                    : "border-line bg-surface text-muted hover:border-brand hover:text-brand"
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview */}
      <div className="card p-6">
        <h2 className="text-base font-bold text-ink">Detailed overview</h2>
        <div className="mt-5">
          <label className="label" htmlFor="studio-overview">
            Description
          </label>
          <textarea
            id="studio-overview"
            rows={5}
            className="input resize-y"
            placeholder="Describe the space, the gear included, house rules and what makes it perfect for shoots…"
            value={form.overview}
            onChange={setField("overview")}
            required
          />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn btn-ghost px-6 py-3"
        >
          Cancel
        </button>
        <button type="submit" disabled={saving} className="btn btn-primary px-8 py-3">
          {saving && <Spinner size={16} />}
          {saving
            ? "Saving…"
            : mode === "edit"
              ? "Save Changes"
              : "Publish Studio"}
        </button>
      </div>
    </form>
  );
}
