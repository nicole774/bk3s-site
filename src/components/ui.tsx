import { cn } from "@/lib/utils";

/** Badge de statut générique : associe une valeur à un style et un libellé FR. */
const TONES = {
  gray: "bg-gray-100 text-gray-700 ring-gray-200",
  gold: "bg-gold/10 text-gold ring-gold/30",
  navy: "bg-navy/10 text-navy ring-navy/20",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
} as const;

export type Tone = keyof typeof TONES;

export function Badge({ tone = "gray", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, description, children }: { title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
      <p className="font-medium text-ink">{title}</p>
      {description ? <p className="mx-auto mt-1 max-w-md text-sm text-ink-soft">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

export function StatCard({ label, value, hint }: { label: string; value: React.ReactNode; hint?: string }) {
  return (
    <div className="card">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-navy">{value}</p>
      {hint ? <p className="mt-1 text-xs text-gray-400">{hint}</p> : null}
    </div>
  );
}

export function Alert({ tone = "red", children }: { tone?: "red" | "green" | "amber"; children: React.ReactNode }) {
  const styles = {
    red: "border-red-200 bg-red-50 text-red-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  } as const;
  return <div className={cn("rounded-md border px-4 py-3 text-sm", styles[tone])}>{children}</div>;
}
