import { CountUp } from "@/components/ui/count-up";
import { cn } from "@/lib/cn";

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

/** Animated stat row — counts up on scroll into view. */
export function StatStrip({
  stats,
  variant = "light",
  className,
}: {
  stats: Stat[];
  variant?: "light" | "dark";
  className?: string;
}) {
  const dark = variant === "dark";
  return (
    <dl
      className={cn(
        "c-stat-strip grid grid-cols-2 gap-px overflow-hidden rounded-lg border md:grid-cols-4",
        dark ? "border-paper/12 bg-paper/12" : "border-rule bg-rule",
        className,
      )}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          className={cn(
            "flex flex-col gap-1 px-6 py-8 sm:py-10",
            dark ? "bg-carbon" : "bg-paper",
          )}
        >
          <dd
            className={cn(
              "font-display text-fluid-3xl tabular-nums leading-none",
              dark ? "text-paper" : "text-ink",
            )}
          >
            <CountUp value={s.value} suffix={s.suffix} />
          </dd>
          <dt
            className={cn(
              "mt-2 text-xs uppercase tracking-[0.16em]",
              dark ? "text-paper/60" : "text-ink-mute",
            )}
          >
            {s.label}
          </dt>
        </div>
      ))}
    </dl>
  );
}
