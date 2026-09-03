import Link from "next/link";
import Button from "@/components/ui/button";
import Image from "next/image";
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
    <>
      <header className="sticky inset-x-0 top-0 z-40 bg-ink backdrop-blur-[18px] backdrop-saturate-140">
        <div className="mx-auto flex h-21 max-w-340 items-center justify-between gap-7 px-6 md:px-12">
          <Link href="#" className="flex flex-none items-baseline gap-3">
            <Image
              src="/assets/logo.svg"
              alt="Infoline Logo"
              width={100}
              height={24}
            />
          </Link>

          <nav className="hidden min-w-0 items-center gap-6 min-[1081px]:flex">
            {menuItems.map((item) => (
              <Link
                key={item}
                href="#"
                className="whitespace-nowrap text-slate-100 border-b border-transparent py-1.5 text-[13.5px] font-medium tracking-[0.01em] transition-colors duration-250 hover:border-brandblue-500 hover:text-cyan-50"
              >
                {item}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <LanguageSwitcher />
            <Button href="/">Talk to an Expert</Button>
          </div>
        </div>
      </header>
    </>
  );
};
