import Image from "next/image";
import { useTranslations } from "next-intl";
import { MaskText, Stagger, StaggerItem } from "@/components/ui/motion";

type Logo = { src: string; alt: string };

/**
 * Clients strip. Centered masked heading over a hairline divider, then a
 * staggered row of client logos (reusing the shared /assets/clients set).
 */
export default function Clients() {
  const t = useTranslations("SolutionsPage");
  const logos = t.raw("clients.logos") as Logo[];

  return (
    <section className="bg-white py-6xl">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <div className="border-t border-slate-100 pt-12">
          <Stagger
            as="div"
            className="mb-4xl flex flex-col items-center gap-sm text-center"
            stagger={0.14}
          >
            <StaggerItem className="flex flex-col items-center">
              <p className="overline-sm-medium mb-sm text-slate-500">
                {t("clients.eyebrow")}
              </p>
              <MaskText
                as="h2"
                className="heading-xl-bold text-center text-slate-900"
                segments={[{ text: t("clients.title") }]}
                amount={0.5}
                duration={0.8}
              />
            </StaggerItem>
          </Stagger>

          <Stagger
            as="ul"
            className="grid grid-cols-2 items-center gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-7"
            stagger={0.08}
          >
            {logos.map((logo) => (
              <StaggerItem
                as="li"
                key={logo.src}
                className="flex items-center justify-center"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={140}
                  height={48}
                  className="h-10 w-auto object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
