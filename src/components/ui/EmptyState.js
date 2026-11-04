import Link from "next/link";
import { Sparkles } from "lucide-react";

/** Friendly empty state with a call-to-action, shown when lists are empty. */
export default function EmptyState({
  icon: Icon = Sparkles,
  title,
  text,
  actionLabel,
  actionHref,
  onAction,
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-strong dark:text-brand">
        <Icon size={26} />
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink">{title}</h3>
      {text && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{text}</p>
      )}
      {(actionHref || onAction) && (
        <div className="mt-6">
          {onAction ? (
            <button type="button" onClick={onAction} className="btn btn-primary px-6 py-3">
              {actionLabel}
            </button>
          ) : (
            <Link href={actionHref} className="btn btn-primary px-6 py-3">
              {actionLabel}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
