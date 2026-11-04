import { cn } from "@/lib/utils";

/** Branded circular spinner used across loading states. */
export default function Spinner({ size = 20, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block animate-spin rounded-full border-[3px] border-line border-t-brand",
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}
