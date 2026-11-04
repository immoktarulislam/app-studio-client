"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Building2, Eye, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import SmartImage from "@/components/SmartImage";
import EmptyState from "@/components/ui/EmptyState";
import { StudiosGridSkeleton } from "@/components/ui/Skeleton";
import { ConfirmModal } from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { useAuth } from "@/context/AuthContext";
import { studiosApi } from "@/lib/api";
import { formatRate } from "@/lib/utils";

// function ListingsContent() {
//   const { user } = useAuth();
//   const [studios, setStudios] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);
//   const [pendingDelete, setPendingDelete] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   const load = useCallback(async () => {
//     try {
//       const data = await studiosApi.mine(user.email);
//       setStudios(data.studios || []);
//       setLoadError(null);
//     } catch (error) {
//       setLoadError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [user.email]);

//   const retry = () => {
//     setLoading(true);
//     load();
//   };

//   useEffect(() => {
//     Promise.resolve().then(load);
//   }, [load]);

//   const confirmDelete = async () => {
//     if (!pendingDelete) return;
//     setDeleting(true);
//     try {
//       await studiosApi.remove(pendingDelete._id);
//       toast.success(`"${pendingDelete.title}" was removed from the marketplace.`);
//       setPendingDelete(null);
//       load();
//     } catch (error) {
//       toast.error(error.message);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
//       <div className="flex flex-wrap items-end justify-between gap-4">
//         <div>
//           <span className="section-kicker">Your spaces</span>
//           <h1 className="section-title mt-2">My Studio Listings</h1>
//           <p className="section-sub">
//             {loading
//               ? "Loading your listings…"
//               : `${studios.length} ${studios.length === 1 ? "studio" : "studios"} published under ${user.email}`}
//           </p>
//         </div>
//         <Link href="/add-studio" className="btn btn-primary">
//           <Plus size={16} /> Add New Studio
//         </Link>
//       </div>

//       <div className="mt-8">
//         {loading ? (
//           <StudiosGridSkeleton count={3} />
//         ) : loadError ? (
//           <EmptyState
//             icon={Building2}
//             title="We could not load your listings"
//             text={loadError}
//             actionLabel="Try again"
//             onAction={retry}
//           />
//         ) : studios.length === 0 ? (
//           <EmptyState
//             icon={Building2}
//             title="You have not listed a studio yet"
//             text="Turn your cyc wall, podcast booth or workshop into steady income — publishing takes about two minutes."
//             actionLabel="Add your first studio"
//             actionHref="/add-studio"
//           />
//         ) : (
//           <ul className="space-y-5">
//             {studios.map((studio) => (
//               <li key={studio._id} className="card flex flex-col gap-5 p-5 sm:flex-row">
//                 <SmartImage
//                   src={studio.image}
//                   alt={studio.title}
//                   className="h-44 w-full shrink-0 rounded-xl object-cover sm:h-32 sm:w-48"
//                 />
//                 <div className="flex min-w-0 flex-1 flex-col">
//                   <div className="flex flex-wrap items-center gap-2">
//                     <span className="badge badge-brand">{studio.category}</span>
//                     <span className="text-xs font-semibold text-muted">
//                       {formatRate(studio.hourlyRate)}
//                     </span>
//                   </div>
//                   <h2 className="mt-2 truncate text-lg font-bold text-ink">
//                     {studio.title}
//                   </h2>
//                   <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
//                     <MapPin size={14} /> {studio.location}
//                   </p>
//                   <p className="mt-1 text-xs text-muted">
//                     {studio.amenities?.length || 0} amenities · Capacity{" "}
//                     {studio.maxCapacity}
//                   </p>

//                   <div className="mt-auto flex flex-wrap gap-2 pt-4">
//                     <Link
//                       href={`/studios/${studio._id}`}
//                       className="btn btn-ghost btn-sm"
//                     >
//                       <Eye size={14} /> View
//                     </Link>
//                     <Link
//                       href={`/studios/edit/${studio._id}`}
//                       className="btn btn-dark btn-sm"
//                     >
//                       <Pencil size={14} /> Update
//                     </Link>
//                     <button
//                       type="button"
//                       onClick={() => setPendingDelete(studio)}
//                       className="btn btn-danger btn-sm"
//                     >
//                       <Trash2 size={14} /> Delete
//                     </button>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <ConfirmModal
//         open={Boolean(pendingDelete)}
//         onClose={() => !deleting && setPendingDelete(null)}
//         onConfirm={confirmDelete}
//         loading={deleting}
//         title="Delete this studio?"
//         message={`"${pendingDelete?.title}" will be permanently removed from the marketplace, including its gallery and reviews. This cannot be undone.`}
//         confirmLabel="Delete studio"
//       />
//     </div>
//   );
// }

export default function MyListingsPage() {
  return (
    <ProtectedRoute>
      <ListingsContent />
    </ProtectedRoute>
  );
}
