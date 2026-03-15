"use client";

import { Mic, Rocket, Sparkles, MessageCircle } from "lucide-react";
import type { DrillType } from "@/types";
import { getDrillLabel, getDrillDescription, getDrillDuration } from "@/lib/drills/topics";
import { cn } from "@/lib/utils";

interface DrillPickerProps {
  onSelect: (type: DrillType) => void;
}

const DRILL_ICONS: Record<DrillType, typeof Mic> = {
  impromptu: Mic,
  elevator: Rocket,
  opening: Sparkles,
  qa: MessageCircle,
};

const DRILL_COLORS: Record<DrillType, string> = {
  impromptu: "#E85D3A",
  elevator: "#2563EB",
  opening: "#8B5CF6",
  qa: "#16A34A",
};

const DRILL_TYPES: DrillType[] = ["impromptu", "elevator", "opening", "qa"];

export function DrillPicker({ onSelect }: DrillPickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {DRILL_TYPES.map((type) => {
        const Icon = DRILL_ICONS[type];
        const color = DRILL_COLORS[type];
        const duration = getDrillDuration(type);

        return (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={cn(
              "card-soft card-hover rounded-2xl bg-white p-5 text-left"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}14` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-[var(--color-stage-text)]">
                  {getDrillLabel(type)}
                </h3>
                <p className="mt-1 text-xs text-[var(--color-stage-text-muted)] leading-relaxed">
                  {getDrillDescription(type)}
                </p>
                {duration > 0 && (
                  <span
                    className="mt-2 inline-block rounded-md px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      backgroundColor: `${color}14`,
                      color,
                    }}
                  >
                    {duration}s
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
