import { useTranslations } from "next-intl";
import Image from "next/image";
import { Reveal, Stagger, StaggerItem, CountUp } from "@/components/ui/motion";

type Stat = { value: text; unit?: string; label: string };
type Badge = { src: string; alt: string; width: number; height: number };

export default function Proof() {
  const t = useTranslations("Proof");
  const stats = t.raw("stats") as Stat[];
  const badges = t.raw("badges") as Badge[];

  return (
    <section>
      {/* Stats bar */}
      <div className="bg-[#0a1014] text-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col px-6 md:px-12 py-11 lg:flex-row lg:items-center lg:justify-start">
          <Stagger
            as="dl"
            className="grid flex-1 grid-cols-2 gap-y-8 md:grid-cols-4"
            stagger={0.13}
            amount={0.3}
          >
            {stats.map((stat) => (
              <StaggerItem key={stat.label} className="max-w-[570px]">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-bold sm:text-4xl">
                  <CountUp
                    value={stat.value}
                    duration={stat.value.toString().length > 2 ? 0.8 : 2}
                  />
                  {stat.unit && (
                    <span className="ml-1 text-base font-medium text-slate-400">
                      {stat.unit}
                    </span>
                  )}
                </dd>
                <p className="mt-2 text-[13px] leading-snug text-slate-300">
                  {stat.label}
                </p>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal
            direction="end"
            delay={0.25}
            distance={40}
            className="flex items-center gap-4.5 border-white/10 lg:border-l lg:pl-2"
          >
            {badges.map((badge) => (
              <Image
                key={badge.alt}
                src={badge.src}
                alt={badge.alt}
                width={badge.width}
                height={badge.height}
                loading="lazy"
                className="w-auto object-contain"
              />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
