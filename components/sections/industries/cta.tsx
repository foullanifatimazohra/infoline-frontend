import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Button from "@/components/ui/button";
import { Reveal, Parallax } from "@/components/ui/motion";

export default function Cta() {
  const t = useTranslations("IndustriesPage");

  return (
    <section className="bg-white pb-6xl">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <Reveal
          as="div"
          className="relative overflow-hidden rounded-2xl bg-brandblue-900 p-10 lg:px-11 lg:py-15"
          amount={0.25}
          duration={1.15}
        >
          <Parallax
            className="pointer-events-none absolute inset-x-0 -inset-y-[20%]"
            speed={0.12}
          >
            <Image
              src="/assets/options/bg.jpg"
              alt=""
              fill
              aria-hidden
              className="object-cover object-top-right"
              priority={false}
            />
          </Parallax>

          <div className="relative z-10 flex flex-col justify-between gap-xl md:items-center lg:flex-row">
            <div>
              <h3 className="heading-xl-bold mb-4 max-w-[20ch] text-white lg:text-[36px]">
                {t("cta.title")}
              </h3>
              <p className="body-lg-regular max-w-[54ch] text-brandblue-100">
                {t("cta.description")}
              </p>
            </div>
            <Button href={t("cta.button.href")} size="large" variant="primary">
              {t("cta.button.label")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
