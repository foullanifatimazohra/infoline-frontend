type IconProps = {
  /** Path to an SVG file, e.g. "/assets/icons/headphones.svg" */
  src: string;
  className?: string;
  "aria-hidden"?: boolean;
};

/**
 * Renders an SVG file as a CSS mask so its color follows `background-color`
 * (i.e. Tailwind text/bg color utilities recolor it, including on hover).
 */
export default function Icon({ src, className = "", ...rest }: IconProps) {
  return (
    <span
      role="img"
      className={`inline-block bg-current ${className}`}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
      {...rest}
    />
  );
}
