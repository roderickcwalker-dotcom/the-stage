import { cn, scoreBgColor } from "@/lib/utils";

interface MetricPillProps {
  label: string;
  value: number | string;
  isScore?: boolean;
  className?: string;
}

export function MetricPill({
  label,
  value,
  isScore = false,
  className,
}: MetricPillProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2",
        className
      )}
    >
      <span className="text-sm text-[var(--color-stage-text-secondary)]">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-semibold",
          isScore && typeof value === "number"
            ? scoreBgColor(value) + " rounded-md px-2 py-0.5"
            : "text-[var(--color-stage-text)]"
        )}
      >
        {typeof value === "number" && isScore ? `${value}/10` : value}
      </span>
    </div>
  );
}
