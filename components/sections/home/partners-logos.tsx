"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  motion,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { Stagger, StaggerItem, MaskText } from "@/components/ui/motion";

export type PartnerLogo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type Props = {
  durationSeconds?: number;
};

// Replace with data fetched from your backend.
const DEMO_LOGOS: PartnerLogo[] = [
  { src: "/assets/clients/moh.svg", alt: "Ministry of Health" },
  {
    src: "/assets/clients/tra.svg",
    alt: "Telecommunications Regulatory Authority",
  },
  { src: "/assets/clients/asyad.svg", alt: "ASYAD" },
  {
    src: "/assets/clients/paew.svg",
    alt: "Public Authority for Electricity and Water",
  },
  {
    src: "/assets/clients/ncsi.svg",
    alt: "National Centre for Statistics & Information",
  },
  { src: "/assets/clients/manpower.svg", alt: "Ministry of Manpower" },
  { src: "/assets/clients/oman-post.svg", alt: "Oman Post" },
];

export default function PartnerLogos({ durationSeconds = 30 }: Props) {
  const t = useTranslations("Proof");
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  // Width of one (un-duplicated) logo set — the wrap distance.
  const halfWidth = useRef(0);

  // Pause when off-screen so it doesn't run in the background.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Measure half the track (the original set) and keep it fresh on resize.
  useEffect(() => {
    const measure = () => {
      if (trackRef.current)
        halfWidth.current = trackRef.current.scrollWidth / 2;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [DEMO_LOGOS]);

  useAnimationFrame((_, delta) => {
    if (!inView || hovered || prefersReducedMotion || !halfWidth.current)
      return;
    // px per ms so one full set scrolls by in `durationSeconds`.
    const pxPerMs = halfWidth.current / (durationSeconds * 1000);
    let next = x.get() - pxPerMs * delta;
    // Wrap seamlessly once a full set has passed.
    if (next <= -halfWidth.current) next += halfWidth.current;
    x.set(next);
  });

  if (!DEMO_LOGOS.length) return null;

  // Duplicate once so the wrap is invisible.
  const track = [...DEMO_LOGOS, ...DEMO_LOGOS];

  return (
    <div className="bg-white py-20 sm:py-24">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-8">
        <Stagger
          as="div"
          className="flex flex-col items-center text-center"
          stagger={0.14}
          amount={0.4}
        >
          <StaggerItem
            as="p"
            className="text-[12px] font-medium uppercase tracking-[0.28em] text-slate-400"
          >
            {t("eyebrow")}
          </StaggerItem>
          <MaskText
            as="h2"
            className="mt-4 text-3xl text-slate-900 font-bold tracking-tight sm:text-4xl"
            segments={[{ text: t("title") }]}
            amount={0.5}
            duration={0.8}
          />
          <StaggerItem
            as="p"
            className="mt-4 text-[15px] max-w-[54ch] leading-relaxed text-slate-700"
          >
            {t("description")}
          </StaggerItem>
        </Stagger>

        <div className="mt-7">
          <div
            ref={containerRef}
            className="relative w-full overflow-hidden [--gap:4rem]"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            dir="ltr"
            style={{ overflow: "hidden", width: "100%" }}
          >
            <motion.ul
              ref={trackRef}
              style={{ x }}
              className="flex w-max items-center gap-(--gap)"
            >
              {track.map((logo, i) => (
                <li key={`${logo.src}-${i}`} className="flex-none">
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width ?? 120}
                    height={88}
                    loading="lazy"
                    decoding="async"
                    // Duplicated set is decorative for screen readers.
                    aria-hidden={i >= DEMO_LOGOS.length}
                    className="h-22 w-auto object-contain transition"
                  />
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        <div className="mt-7 text-center">
          <Link
            href={t("clientsCta.href")}
            className="group inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-brandblue-500 transition-colors hover:text-brandblue-600"
          >
            {t("clientsCta.label")}
            <ArrowRight
              className="size-4 rtl:rotate-180 transition-transform duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
