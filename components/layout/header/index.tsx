import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import Button from "@/components/ui/button";
import LanguageSwitcher from "./language-switcher";

const menuItems = [
  "Solutions",
  "Industries",
  "Case Studies",
  "Insights",
  "About",
  "Careers",
  // "Contact",
];

export const Header = () => {
  return (
    <header className="sticky inset-x-0 top-0 z-40 bg-ink backdrop-blur-[18px] backdrop-saturate-140">
      {/* Toggle state lives here; `peer` lets siblings react to :checked */}
      <input
        type="checkbox"
        id="nav-toggle"
        className="peer hidden"
        aria-hidden
      />

      <div className="mx-auto flex h-21 max-w-7xl items-center justify-between gap-7 px-6 md:px-12">
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
              key={item}
              href="#"
              className="whitespace-nowrap border-b border-transparent py-1.5 text-[13.5px] font-medium tracking-[0.01em] text-slate-100 transition-colors duration-250 hover:border-brandblue-500 hover:text-cyan-50"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-5 min-[1081px]:flex">
          <LanguageSwitcher />
          <Button href="/" icon={ArrowRight} size="small" iconPosition="right">
            Talk to an Expert
          </Button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 min-[1081px]:hidden">
          <LanguageSwitcher />
          {/* Label toggles the checkbox; swap icon based on peer state */}
          <label
            htmlFor="nav-toggle"
            aria-label="Toggle menu"
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-white/10 text-slate-100 transition-colors hover:border-brandblue-500/60 hover:text-white"
          >
            <Menu className="size-5 peer-checked:hidden" />
            <X className="hidden size-5 peer-checked:block" />
          </label>
        </div>
      </div>

      {/* Backdrop — closes menu when clicked (it's a label for the same checkbox) */}
      <label
        htmlFor="nav-toggle"
        className="pointer-events-none fixed inset-0 top-21 z-30 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 peer-checked:pointer-events-auto peer-checked:opacity-100 min-[1081px]:hidden"
      />

      {/* Mobile drawer */}
      <nav className="invisible fixed inset-x-0 top-21 z-40 -translate-y-3 border-t border-white/10 bg-ink px-6 pb-8 pt-4 opacity-0 transition-[opacity,transform,visibility] duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] peer-checked:visible peer-checked:translate-y-0 peer-checked:opacity-100 md:px-12 min-[1081px]:hidden">
        <ul className="flex flex-col">
          {menuItems.map((item) => (
            <li key={item}>
              <Link
                href="#"
                className="block border-b border-white/[.06] py-4 text-[15px] font-medium text-slate-100 transition-colors hover:text-brandblue-500"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button
            href="/"
            icon={ArrowRight}
            size="large"
            iconPosition="right"
            className="w-full justify-center"
          >
            Talk to an Expert
          </Button>
        </div>
      </nav>
    </header>
  );
};
