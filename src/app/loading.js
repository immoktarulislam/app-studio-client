import Link from "next/link";
import PageSkeleton from "@/components/ui/Skeleton";

/** Route-level loading state (branded skeleton during transitions). */
export default function Loading() {
  return <PageSkeleton />;
}
