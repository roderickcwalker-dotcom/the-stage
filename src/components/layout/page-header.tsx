interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1
        className="text-3xl tracking-tight text-[var(--color-stage-text)] md:text-4xl"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-[var(--color-stage-text-secondary)] text-base">
          {subtitle}
        </p>
      )}
    </div>
  );
}
