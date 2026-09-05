import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type Industry = { title: string; image: string; href: string };

export default function Industries() {
  const t = useTranslations("Industries");
  const items = t.raw("items") as Industry[];

  return (
    <section className="bg-white py-20 text-[#0a1014] sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[12px] overline-sm-medium uppercase tracking-[0.28em] text-slate-400">
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 max-w-[20ch] heading-2xl-semibold leading-tight tracking-tight sm:text-[42px]">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-[55ch] body-lg-regular leading-relaxed text-slate-500">
            {t("description")}
          </p>
        </div>

        {/* Grid */}
        <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li key={item.title}>
              <Link
                href={item.href}
                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                />
                {/* Legibility gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                {/* Hover blue wash */}
                <div className="absolute inset-0 bg-brandblue-500/0 transition-colors duration-500 group-hover:bg-brandblue-500/15" />

                <h3 className="absolute inset-x-0 bottom-0 max-w-[85%] p-6 text-lg font-semibold leading-snug text-white">
                  {item.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
