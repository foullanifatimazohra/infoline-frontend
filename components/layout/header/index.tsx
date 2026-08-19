import Link from "next/link";
import TopBar from "./top-bar";
import Button from "@/components/ui/button";

const menuItems = [
  "Solutions",
  "Industries",
  "Case Studies",
  "Insights",
  "About",
  "Careers",
  "Contact",
];
export const Header = () => {
  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-40 border-b border-white/8 bg-ink-900/[.82] backdrop-blur-[18px] backdrop-saturate-140">
        <div className="mx-auto flex h-21 max-w-340 items-center justify-between gap-7 px-6 md:px-12">
          <Link href="#" className="flex flex-none items-baseline gap-3">
            <span className="text-[23px] font-bold tracking-[-.03em]">
              Infoline
            </span>
          </Link>

          <nav className="hidden min-w-0 items-center gap-6 min-[1081px]:flex">
            {menuItems.map((item) => (
              <Link
                key={item}
                href="#"
                className="whitespace-nowrap uppercase border-b border-transparent py-1.5 text-[13.5px] font-medium tracking-[0.01em] transition-colors duration-250 hover:border-brandblue-500 hover:text-gray-600"
              >
                {item}
              </Link>
            ))}
          </nav>

          <Button href="/">Talk to an Expert</Button>
        </div>
      </header>
    </>
  );
};
