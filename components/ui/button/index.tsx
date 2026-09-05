import { Link } from "@/i18n/navigation";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "icon";
type ButtonSize = "small" | "large";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  children?: ReactNode;
}

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = LinkProps | NativeButtonProps;

const sizeClasses: Record<
  ButtonSize,
  {
    text: string;
    tracking: string;
    padding: string;
    iconPadding: string;
    gap: string;
  }
> = {
  small: {
    text: "text-[12px]",
    tracking: "tracking-[0.1em]",
    padding: "px-6 py-3.5",
    iconPadding: "p-3.5",
    gap: "gap-2.5",
  },
  large: {
    text: "text-[13px]",
    tracking: "tracking-[0.11em]",
    padding: "px-7.5 py-[20px]",
    iconPadding: "p-[20px]",
    gap: "gap-3",
  },
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brandblue-500 text-white shadow-[0_8px_24px_-12px_rgba(28,151,212,.9)] transition-[background,box-shadow,transform] duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] hover:bg-brandblue-600 hover:shadow-[0_16px_34px_-14px_rgba(28,151,212,1)]",
  secondary:
    "border border-white/18 text-white transition-[border-color,color,background] duration-300 hover:border-white/[.42] hover:bg-white/[.04]",
  icon: "border border-white/18 text-white transition-[border-color,color,background] duration-300 hover:border-white/[.42] hover:bg-white/[.04]",
};

/** Anchor/button with pointer-tracking magnetic hover, ported from `data-magnetic`. */
export default function Button({
  href,
  children,
  className = "",
  variant = "primary",
  size = "small",
  icon: Icon,
  iconPosition = "left",
  ...rest
}: ButtonProps) {
  const isIconOnly = variant === "icon";
  const s = sizeClasses[size];

  const baseClasses = [
    "inline-flex flex-none items-center justify-center whitespace-nowrap font-semibold uppercase",
    isIconOnly ? "rounded-full" : "rounded-md",
    isIconOnly ? s.iconPadding : `${s.padding} ${s.gap}`,
    s.text,
    s.tracking,
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const iconSize = isIconOnly ? "size-[18px]" : "size-3";

  const content = isIconOnly ? (
    Icon && <Icon className={iconSize} strokeWidth={2} />
  ) : (
    <>
      {Icon && iconPosition === "left" && (
        <Icon className={iconSize} strokeWidth={2} />
      )}
      {children}
      {Icon && iconPosition === "right" && (
        <Icon className={iconSize} strokeWidth={2} />
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      className={baseClasses}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}
