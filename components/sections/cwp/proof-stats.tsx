import { CountUp } from "@/components/ui/motion";

/**
 * Proof strip for the CMS templates: hero metrics (case studies), proof
 * results (services) or proofMetric/proofPoint (industries) — values count
 * up on reveal, matching the site's stat treatment. CMS metric strings are
 * free text ("[-00%]", "80/20", "2x") so they render verbatim; CountUp only
 * animates numeric-looking prefixes and falls back to static text otherwise.
 */
export default function ProofStats({
  stats,
  columns = 3,
}: {
  stats: { value: string; label?: string | null }[];
  columns?: 2 | 3 | 4;
}) {
  if (!stats.length) return null;

  const gridCols =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
        ? "sm:grid-cols-2 lg:grid-cols-4"
        : "sm:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-slate-200 ${gridCols}`}>
      {stats.map((stat, i) => (
        <div key={`${stat.label ?? stat.value}-${i}`} className="bg-white p-6 lg:p-8">
          <CountUp
            value={stat.value}
            className="heading-2xl-semibold text-brandblue-600"
          />
          {stat.label ? (
            <p className="body-md-regular mt-2 text-slate-600">{stat.label}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
