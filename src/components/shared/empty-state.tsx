import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-stage-soft)] mb-4">
        <Icon className="h-8 w-8 text-[var(--color-stage-primary)]" />
      </div>
      <h3
        className="text-lg text-[var(--color-stage-text)] mb-1"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {title}
      </h3>
      <p className="text-sm text-[var(--color-stage-text-muted)] max-w-sm mb-4">
        {description}
      </p>
      {action}
    </div>
  );
}
