import { Link } from "@/i18n/navigation";
const utilityNav = [
  { label: "Client Portal", href: "/client-portal" },
  { label: "Support", href: "/support" },
];

export default function TopBar() {
  return (
    <div className="border-b border-white/[.07] bg-ink-900 text-slate-300">
      <div className="mx-auto flex h-10 max-w-[1360px] items-center justify-between px-6 md:px-12">
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          UTILITY BAR
        </span>
        <div className="flex items-center gap-[26px]">
          {utilityNav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="whitespace-nowrap text-[11.5px] font-medium uppercase tracking-[0.06em] text-slate-200 transition-colors duration-250 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <span className="flex items-center gap-2 font-mono text-[11.5px] font-medium text-slate-500">
            <span className="">EN</span>
            <span className="opacity-40">|</span>
            <span>ع</span>
          </span>
        </div>
      </div>
    </div>
  );
}
