"use client";

import { useState, useMemo } from "react";
import { Nav } from "@/components/layout/nav";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SearchBar } from "@/components/journal/search-bar";
import { SessionList } from "@/components/journal/session-list";
import { ProgressRadar } from "@/components/journal/progress-radar";
import { ProgressLine } from "@/components/journal/progress-line";
import { StreakCalendar } from "@/components/journal/streak-calendar";
import { useSessions } from "@/hooks/use-sessions";
import { Clock, Mic, Flame, TrendingUp } from "lucide-react";

export default function JournalPage() {
  const { sessions, userProfile, deleteSession } = useSessions();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchesType = typeFilter === "all" || s.type === typeFilter;
      const matchesQuery =
        !query ||
        s.topic.toLowerCase().includes(query.toLowerCase()) ||
        s.transcript.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesQuery;
    });
  }, [sessions, query, typeFilter]);

  const avgScore =
    sessions.length > 0
      ? (
          sessions.reduce((sum, s) => sum + s.scores.overall, 0) /
          sessions.length
        ).toFixed(1)
      : "—";

  const stats = [
    {
      icon: Mic,
      label: "Sessions",
      value: userProfile?.totalSessions ?? sessions.length,
    },
    {
      icon: Clock,
      label: "Minutes",
      value: userProfile?.totalMinutes ?? 0,
    },
    {
      icon: Flame,
      label: "Streak",
      value: userProfile?.currentStreak ?? 0,
    },
    {
      icon: TrendingUp,
      label: "Avg Score",
      value: avgScore,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 px-6 pb-24 pt-6 md:pb-6 md:pl-52">
        <div className="mx-auto max-w-3xl">
          <PageHeader
            title="Journal"
            subtitle="Track your speaking journey"
          />

          {/* Stats Row */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="card-soft rounded-xl bg-white p-4 flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-stage-soft)]">
                  <Icon className="h-4 w-4 text-[var(--color-stage-primary)]" />
                </div>
                <div>
                  <div className="text-lg font-bold text-[var(--color-stage-text)]">
                    {value}
                  </div>
                  <div className="text-xs text-[var(--color-stage-text-muted)]">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Tabs defaultValue="history">
            <TabsList className="mb-6 w-full bg-[var(--color-stage-bg)]">
              <TabsTrigger value="history" className="flex-1">
                History
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex-1">
                Progress
              </TabsTrigger>
              <TabsTrigger value="streaks" className="flex-1">
                Streaks
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history">
              <div className="space-y-4">
                <SearchBar
                  query={query}
                  onQueryChange={setQuery}
                  typeFilter={typeFilter}
                  onTypeFilterChange={setTypeFilter}
                />
                <SessionList
                  sessions={filteredSessions}
                  onDelete={deleteSession}
                />
              </div>
            </TabsContent>

            <TabsContent value="progress">
              <div className="space-y-4">
                <ProgressRadar sessions={sessions} />
                <ProgressLine sessions={sessions} />
              </div>
            </TabsContent>

            <TabsContent value="streaks">
              <StreakCalendar
                sessions={sessions}
                currentStreak={userProfile?.currentStreak ?? 0}
                longestStreak={userProfile?.longestStreak ?? 0}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
