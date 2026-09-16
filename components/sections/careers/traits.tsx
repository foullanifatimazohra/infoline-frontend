import { useTranslations } from "next-intl";
import {
  Sparkles,
  MessagesSquare,
  BookOpen,
  Zap,
  Target,
  MousePointerClick,
  type LucideIcon,
} from "lucide-react";
import { MaskText, Stagger, StaggerItem } from "@/components/ui/motion";

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  messages: MessagesSquare,
  book: BookOpen,
  zap: Zap,
  target: Target,
  pointer: MousePointerClick,
};

/**
 * "What we look for" — six outlined trait pills with icons, wrapping freely
 * exactly like the design's loose pill cloud.
 */
export default function Traits() {
  const t = useTranslations("CareersPage");
  const items = t.raw("traits.items") as { icon: string; label: string }[];

  return (
    <section className="bg-white pb-24 lg:pb-32">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <Stagger
          as="div"
          className="flex flex-col items-start"
          stagger={0.1}
          delayChildren={0.05}
          amount={0.3}
        >
          <StaggerItem className="mb-5" distance={24}>
            <span className="font-mono text-[11.5px] font-medium uppercase tracking-[0.2em] text-brandblue-600">
              {t("traits.eyebrow")}
            </span>
          </StaggerItem>

          <MaskText
            as="h2"
            className="max-w-[26ch] text-[30px] font-bold leading-[1.15] tracking-[-.025em] text-ink lg:text-[40px]"
            segments={[{ text: t("traits.title") }]}
            stagger={0.05}
            duration={0.85}
          />

          <Stagger
            as="ul"
            className="mt-12 flex flex-wrap gap-3.5"
            stagger={0.07}
            delayChildren={0.1}
            amount={0.2}
          >
            {items.map((item) => {
              const Icon = ICONS[item.icon] ?? Sparkles;
              return (
                <StaggerItem
                  as="li"
                  key={item.label}
                  distance={24}
                  className="flex items-center gap-3 rounded-full border border-grey-300 bg-white px-6 py-4"
                >
                  <Icon className="size-5 text-brandblue-500" strokeWidth={1.8} />
                  <span className="text-[15px] font-medium text-ink lg:text-base">
                    {item.label}
                  </span>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Stagger>
      </div>
    </section>
  );
}
