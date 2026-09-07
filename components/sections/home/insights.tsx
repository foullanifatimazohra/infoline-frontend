import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/ui/motion";

type Insight = {
  category: string;
  title: string;
  image: string;
  href: string;
};

const insights: Insight[] = [
  {
    category: "Customer Experience",
    title: "What a COPC audit actually measures — and why buyers should ask",
    image: "/assets/insights/i1.svg",
    href: "/insights/copc-audit",
  },
  {
    category: "Automation",
    title: "Where a chatbot stops paying for itself in Arabic-first service",
    image: "/assets/insights/i2.svg",
    href: "/insights/chatbot-roi",
  },
  {
    category: "Public Sector",
    title:
      "Outsourcing inside government procurement rules: the practical route",
    image: "/assets/insights/i3.svg",
    href: "/insights/public-sector-procurement",
  },
];

export default function Insights() {
  return (
    <section className="insights py-20 lg:py-26">
      <div className="px-6 lg:px-10 max-w-360">
        <Stagger
          as="div"
          className="flex items-start justify-between gap-lg"
          stagger={0.15}
        >
          <StaggerItem direction="start">
            <p className="overline-sm-medium text-slate-300 mb-sm">Insights</p>
            <h2 className="heading-xl-bold text-[36px] text-white">
              What we are seeing across Omani operations
            </h2>
          </StaggerItem>
          <StaggerItem direction="end">
            <Link
              href="/insights"
              className="overline-sm-medium uppercase text-brandblue-500 hover:text-brandblue-300 transition-colors whitespace-nowrap flex items-center gap-xs"
            >
              All insights
              <ArrowRight className="size-4" />
            </Link>
          </StaggerItem>
        </Stagger>

        <Stagger
          as="div"
          className="mt-11 grid grid-cols-1 md:grid-cols-3 gap-2xl"
          stagger={0.13}
        >
          {insights.map((insight) => (
            <StaggerItem as="div" key={insight.title}>
              <Link
                href={insight.href}
                className="group flex flex-col max-h-[315px]"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-lg bg-slate-800">
                  <Image
                    src={insight.image}
                    alt={insight.title}
                    width={430}
                    height={220}
                    className="object-cover h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="overline-xs-medium mt-3 text-slate-300 mt-lg mb-xs">
                  {insight.category}
                </p>
                <h3 className="body-lg-semibold  text-white leading-snug">
                  {insight.title}
                </h3>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
