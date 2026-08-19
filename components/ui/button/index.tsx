export const Button = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      className={`inline-flex flex-none items-center gap-2.5 whitespace-nowrap rounded-[2px] bg-brandblue-500 px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.1em] text-white shadow-[0_8px_24px_-12px_rgba(28,151,212,.9)] transition-[background,box-shadow,transform] duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] hover:bg-brandblue-600 hover:shadow-[0_16px_34px_-14px_rgba(28,151,212,1)] ${className || ""}`}
      {...props}
    >
      {children}
      <span className="text-[14px]" />
    </button>
  );
};
