import { Link } from "@/i18n/navigation";
import Button from "@/components/ui/button";
import Image from "next/image";

import { footerColumns, legalLinks, certifications } from "./data";

export const Footer = () => {
  return (
    <footer id="careers" className="bg-ink pb-10 pt-[76px] text-slate-300">
      <div className="mx-auto max-w-340 px-6 md:px-12">
        <div className="grid grid-cols-1 gap-11 sm:grid-cols-2 lg:grid-cols-[1.75fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-baseline gap-3">
              <Image
                src="/assets/logo.svg"
                alt="Infoline Logo"
                width={100}
                height={24}
              />
            </Link>
            <p className="mt-5 body-sm-regular text-slate-400">
              Registered office, Muscat, Sultanate of Oman +968 [phone] ·
              hello@infoline.om
            </p>
            <div className="mt-6 flex gap-3">
              {certifications.map((cert) => (
                <div
                  key={cert}
                  className="flex h-[74px] w-[74px] items-center justify-center rounded-full border border-white/[.18] text-center font-mono text-[9px] font-medium leading-[1.2] text-slate-100"
                >
                  {cert.split(" ").map((word) => (
                    <span key={word} className="block">
                      {word}
                    </span>
                  ))}
                </div>
              ))}
            </div>
            <Button
              href="#cta"
              className="mt-7 inline-flex items-center gap-2.5 rounded-[2px] bg-brandblue-500 px-[26px] py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white transition-[background,transform] duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] hover:bg-brandblue-600"
            >
              Talk to an Expert
            </Button>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="mb-[18px] font-mono text-[10.5px] font-medium uppercase tracking-[0.2em] text-slate-600">
                {column.title}
              </p>
              <div className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[13.5px] leading-[1.4] text-slate-200 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 border-t border-white/[.08] pt-[26px] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[12px] text-slate-600">
            © 2026 Infoline LLC · an Omantel Group company
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[12px] text-slate-500 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
