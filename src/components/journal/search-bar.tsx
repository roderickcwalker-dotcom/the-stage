"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
}

export function SearchBar({
  query,
  onQueryChange,
  typeFilter,
  onTypeFilterChange,
}: SearchBarProps) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-stage-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search sessions..."
          className="w-full rounded-xl border border-[var(--border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--color-stage-text)] placeholder:text-[var(--color-stage-text-muted)] focus:border-[var(--color-stage-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-stage-primary)]/20"
        />
      </div>
      <select
        value={typeFilter}
        onChange={(e) => onTypeFilterChange(e.target.value)}
        className="rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-sm text-[var(--color-stage-text)] focus:border-[var(--color-stage-primary)] focus:outline-none"
      >
        <option value="all">All Types</option>
        <option value="practice">Practice</option>
        <option value="drill">Drills</option>
        <option value="qa">Q&A</option>
      </select>
    </div>
  );
}
