import Link from "next/link";
import { Mic, Zap, Target, BookOpen, ArrowRight } from "lucide-react";

const FEATURES = [
  {
    icon: Mic,
    title: "Practice Arena",
    description:
      "Record yourself speaking, get real-time transcription, and receive detailed AI feedback on clarity, structure, and confidence.",
    href: "/practice",
    color: "#E85D3A",
  },
  {
    icon: Zap,
    title: "Drill Mode",
    description:
      "60-second impromptu challenges, elevator pitches, opening line practice, and tough Q&A simulations.",
    href: "/drills",
    color: "#2563EB",
  },
  {
    icon: Target,
    title: "Skill Tracks",
    description:
      "Progress from Foundation to World Class through structured levels — each with targeted drills and clear criteria.",
    href: "/tracks",
    color: "#16A34A",
  },
  {
    icon: BookOpen,
    title: "Session Journal",
    description:
      "Every session logged with scores, transcripts, and AI notes. Track your progress with charts and streak tracking.",
    href: "/journal",
    color: "#8B5CF6",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-stage-primary)] shadow-lg shadow-[var(--color-stage-primary)]/20">
          <Mic className="h-8 w-8 text-white" />
        </div>
        <h1
          className="text-5xl tracking-tight text-[var(--color-stage-text)] md:text-6xl lg:text-7xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          The Stage
        </h1>
        <p className="mt-4 max-w-lg text-lg text-[var(--color-stage-text-secondary)]">
          Your AI speaking coach. Practice, get feedback, and level up from
          nervous speaker to world-class presenter.
        </p>
        <Link
          href="/practice"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--color-stage-primary)] px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-[var(--color-stage-primary)]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Start Practicing
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-sm text-[var(--color-stage-text-muted)]">
          No sign-up needed. Everything stays on your device.
        </p>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description, href, color }) => (
            <Link
              key={href}
              href={href}
              className="group card-soft card-hover rounded-2xl bg-white p-6"
            >
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${color}14` }}
              >
                <Icon className="h-5 w-5" style={{ color }} />
              </div>
              <h3
                className="text-lg text-[var(--color-stage-text)] mb-1"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {title}
              </h3>
              <p className="text-sm text-[var(--color-stage-text-secondary)] leading-relaxed">
                {description}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-stage-primary)] opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
