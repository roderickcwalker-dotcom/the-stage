"use client";

interface TopicInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function TopicInput({ value, onChange, disabled }: TopicInputProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[var(--color-stage-text)]">
        What are you speaking about?
        <span className="text-[var(--color-stage-text-muted)]"> (optional)</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="e.g., Why remote work is the future"
        className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--color-stage-text)] placeholder:text-[var(--color-stage-text-muted)] focus:border-[var(--color-stage-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stage-primary)]/20 disabled:opacity-50"
      />
    </div>
  );
}
