import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/cn";
import type { ProcessStep } from "@/data/service-process";

export function ProcessCards({ steps, dark = false }: { steps: ProcessStep[]; dark?: boolean }) {
  const fiveSteps = steps.length === 5;

  return (
    <ol className={cn(
      "mt-10 grid gap-4 sm:grid-cols-2",
      fiveSteps ? "xl:grid-cols-5" : "lg:grid-cols-4",
    )}>
      {steps.map((step, index) => (
        <li key={step.title} className={cn(
          "group flex min-w-0 flex-col overflow-hidden rounded-sm border",
          dark ? "border-paper/15 bg-paper/[0.04]" : "border-rule bg-paper-warm",
          // Share image, heading, divider and body rows when cards sit side by side.
          fiveSteps && index === steps.length - 1
            ? "xl:row-span-4 xl:grid xl:grid-rows-subgrid xl:gap-0"
            : "sm:row-span-4 sm:grid sm:grid-rows-subgrid sm:gap-0",
          fiveSteps && "sm:last:col-span-2 sm:last:grid sm:last:grid-cols-2 xl:last:col-span-1 xl:last:grid-cols-1",
        )}>
          <div className="relative min-w-0 overflow-hidden">
            <SmartImage
              {...step.image}
              ratio="4 / 3"
              className="h-full w-full !rounded-none"
              sizes={fiveSteps
                ? "(min-width: 1280px) 18vw, (min-width: 640px) 44vw, 92vw"
                : "(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 92vw"}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/60 to-transparent" />
            <span className="absolute bottom-4 left-5 font-display text-3xl leading-none text-paper" aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <div className={cn(
            "flex min-w-0 flex-1 flex-col p-6",
            fiveSteps && index === steps.length - 1
              ? "xl:row-span-3 xl:grid xl:grid-rows-subgrid xl:gap-0"
              : "sm:row-span-3 sm:grid sm:grid-rows-subgrid sm:gap-0",
          )}>
            <h3 className={cn("font-display text-xl leading-snug", dark ? "text-paper" : "text-ink")}>{step.title}</h3>
            <div className="my-4 h-px w-9 bg-accent" aria-hidden />
            <p className={cn("section-lede", dark ? "text-paper/75" : "text-ink-soft")}>{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
