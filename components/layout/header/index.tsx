"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, Menu, X } from "lucide-react";
import Button from "@/components/ui/button";
import { usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./language-switcher";

type NavItem = { label: string; href: string };

export const Header = () => {
  const t = useTranslations("Header");
  const menuItems = t.raw("nav") as NavItem[];

  // Locale-stripped path (e.g. "/about") so the current nav item can be marked.
  const pathname = usePathname();
  const isActive = (href: string) =>
    href !== "#" && (pathname === href || pathname.startsWith(`${href}/`));

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll(); // set correct state on mount (e.g. reload mid-page)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        scrolled
          ? "bg-ink backdrop-blur-[18px] backdrop-saturate-140 shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
          : "bg-transparent"
      }`}
    >
      {/* Toggle state lives here; `peer` lets siblings react to :checked */}
      <input
        type="checkbox"
        id="nav-toggle"
        className="peer hidden"
        aria-hidden
      />

      <div className="mx-auto flex h-21 max-w-360 items-center justify-between gap-7 px-6 md:px-12">
        <Link href="#" className="flex flex-none items-baseline gap-3">
          <Image
            src="/assets/logo.svg"
            alt="Infoline Logo"
            width={100}
            height={24}
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden min-w-0 items-center gap-6 min-[1081px]:flex">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`whitespace-nowrap border-b py-1.5 text-[13.5px] font-medium tracking-[0.01em] transition-colors duration-250 ${
                isActive(item.href)
                  ? "border-brandblue-500 text-brandblue-400"
                  : "border-transparent text-slate-100 hover:border-brandblue-500 hover:text-cyan-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-5 min-[1081px]:flex">
          <LanguageSwitcher />
          <Button
            href={t("cta.href")}
            icon={ArrowRight}
            size="small"
            iconPosition="right"
          >
            {t("cta.label")}
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 min-[1081px]:hidden">
          <LanguageSwitcher />
          <label
            htmlFor="nav-toggle"
            aria-label={t("menuToggle")}
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-white/10 text-slate-100 transition-colors hover:border-brandblue-500/60 hover:text-white"
          >
            <Menu className="size-5 peer-checked:hidden" />
            <X className="hidden size-5 peer-checked:block" />
          </label>
        </div>
      </div>

      {/* Backdrop */}
      <label
        htmlFor="nav-toggle"
        className="pointer-events-none fixed inset-0 top-21 z-30 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 peer-checked:pointer-events-auto peer-checked:opacity-100 min-[1081px]:hidden"
      />

      {/* Mobile drawer */}
      <nav className="invisible fixed inset-x-0 top-21 z-40 -translate-y-3 border-t border-white/10 bg-ink px-6 pb-8 pt-4 opacity-0 transition-[opacity,transform,visibility] duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] peer-checked:visible peer-checked:translate-y-0 peer-checked:opacity-100 md:px-12 min-[1081px]:hidden">
        <ul className="flex flex-col">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`block border-b border-white/[.06] py-4 text-[15px] font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-brandblue-400"
                    : "text-slate-100 hover:text-brandblue-500"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button
            href={t("cta.href")}
            icon={ArrowRight}
            size="large"
            iconPosition="right"
            className="justify-center"
          >
            {t("cta.label")}
          </Button>
        </div>
      </nav>
    </header>
  );
};
