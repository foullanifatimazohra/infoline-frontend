import { useTranslations } from "next-intl";
import { FileText, Download } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { MaskText, Stagger, StaggerItem } from "@/components/ui/motion";

type Doc = { title: string; meta: string; cta: string; href: string };

/**
 * Company documents — download rows for the company profile. The PDFs are not yet
 * wired up, so links point at "#" (placeholder) but are styled per the design.
 */
export default function Documents() {
  const t = useTranslations("AboutPage");
  const items = t.raw("documents.items") as Doc[];

  return (
    <section className="py-24 lg:py-32">
      <div className="grid w-full max-w-360 grid-cols-1 items-start gap-12 px-6 lg:grid-cols-2 lg:gap-20 lg:px-30 mx-auto">
        <div>
          <p className="overline-sm-medium text-slate-400">
            {t("documents.eyebrow")}
          </p>
          <MaskText
            as="h2"
            className="mt-4 heading-2xl-semibold max-w-[20ch] text-slate-900"
            segments={[{ text: t("documents.title") }]}
            amount={0.5}
            duration={0.85}
          />
          <p className="mt-5 max-w-[48ch] body-lg-regular text-slate-700">
            {t("documents.description")}
          </p>
        </div>

        <Stagger
          as="div"
          className="flex flex-col gap-4"
          stagger={0.12}
          amount={0.3}
        >
          {items.map((doc) => (
            <StaggerItem key={doc.title}>
              <Link
                href={doc.href}
                className="group flex items-center gap-5 rounded-xl border border-ink/20 bg-ink/[.02] p-5 transition-colors hover:border-brandblue-500/50 hover:bg-white/[.04]"
              >
                <span className="flex size-12 flex-none items-center justify-center rounded-lg bg-brandblue-500/10 text-brandblue-400">
                  <FileText className="size-5" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block body-lg-medium text-slate-900">
                    {doc.title}
                  </span>
                  <span className="mt-0.5 block body-sm-regular text-slate-900">
                    {doc.meta}
                  </span>
                </span>
                <span className="inline-flex flex-none items-center gap-2 overline-sm-medium text-brandblue-500">
                  {doc.cta}
                  <Download
                    className="size-4 transition-transform duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0.5"
                    strokeWidth={2}
                  />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
