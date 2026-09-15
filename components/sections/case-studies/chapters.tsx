import { useTranslations } from "next-intl";
import {
  Stagger,
  StaggerItem,
  CountUp,
  MaskText,
} from "@/components/ui/motion";

type ApproachRow = { label: string; text: string };
type Result = { value: string; unit: string; text: string };
type Quote = { text: string; attribution: string };

type Chapter = {
  number: string;
  tag: string;
  client: string;
  scale: string;
  serviceLine: string;
  title: string;
  challenge: string;
  approachRows?: ApproachRow[];
  approachText?: string;
  results: Result[];
  quote?: Quote;
};

/**
 * The three case studies. Each chapter pairs a quiet meta rail (number, client,
 * scale, service line) with the story: challenge → approach → results, closed by
 * the client quote where we have one. Content is fully data-driven from the
 * CaseStudiesPage translations so new chapters are one JSON block.
 */
export default function Chapters() {
  const t = useTranslations("CaseStudiesPage");
  const chapters = t.raw("chapters") as Chapter[];
  const label = (k: string) => t(`labels.${k}`);

  return (
    <section className="bg-white py-24 lg:py-36">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <div className="flex flex-col gap-28 lg:gap-44">
          {chapters.map((c) => (
            <article
              key={c.number}
              id={`case-${c.number}`}
              className="grid gap-12 lg:grid-cols-[300px_1fr] lg:gap-20"
            >
              {/* Meta rail */}
              <Stagger
                as="div"
                className="flex flex-col items-start lg:sticky lg:top-32 lg:self-start"
                stagger={0.1}
                delayChildren={0.05}
                amount={0.25}
              >
                <StaggerItem
                  as="span"
                  className="text-[64px] font-bold leading-none tracking-tight text-lightblue-300 lg:text-[72px]"
                  blur={false}
                >
                  {c.number}.
                </StaggerItem>

                <StaggerItem className="mt-7 pt-4">
                  <span className="overline-sm-medium  text-brandblue-600">
                    {label("caseStudy")} · {c.tag}
                  </span>
                </StaggerItem>

                <StaggerItem className="mt-6 w-full border-t border-grey-300 pt-4">
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {label("client")}
                  </div>
                  <p className="body-sm-regular mt-2 max-w-[34ch] text-ink">
                    {c.client}
                  </p>
                </StaggerItem>

                {c.scale ? (
                  <StaggerItem className="mt-6 w-full border-t border-grey-300 pt-4">
                    <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      {label("scale")}
                    </div>
                    <p className="body-sm-regular mt-2 max-w-[34ch] text-ink">
                      {c.scale}
                    </p>
                  </StaggerItem>
                ) : null}

                <StaggerItem className="mt-6 w-full border-t border-grey-300 pt-4">
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {label("serviceLine")}
                  </div>
                  <p className="body-sm-regular mt-2 max-w-[34ch] font-medium text-ink">
                    {c.serviceLine}
                  </p>
                </StaggerItem>
              </Stagger>

              {/* Story column */}
              <div>
                <MaskText
                  as="h2"
                  className="max-w-[30ch] text-[28px] font-bold leading-[1.15] tracking-[-.02em] text-ink lg:text-[36px]"
                  segments={[{ text: c.title }]}
                  amount={0.3}
                  stagger={0.05}
                />

                {/* Challenge */}
                <Stagger
                  as="div"
                  className="mt-10 pt-6"
                  stagger={0.08}
                  amount={0.2}
                >
                  <StaggerItem
                    as="h3"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-slate-900"
                    distance={20}
                  >
                    01 — {label("challenge")}
                  </StaggerItem>
                  <StaggerItem
                    as="p"
                    className="body-base-regular mt-4 max-w-[72ch] text-slate-900"
                    distance={28}
                  >
                    {c.challenge}
                  </StaggerItem>
                </Stagger>

                {/* Approach */}
                <Stagger
                  as="div"
                  className="mt-10 border-t border-grey-300 pt-6"
                  stagger={0.08}
                  amount={0.2}
                >
                  <StaggerItem
                    as="h3"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-slate-900"
                    distance={20}
                  >
                    02 — {label("approach")}
                  </StaggerItem>

                  {c.approachRows ? (
                    <dl className="mt-5 flex flex-col gap-3.5">
                      {c.approachRows.map((row) => (
                        <StaggerItem
                          key={row.label}
                          className="grid grid-cols-[110px_1fr] items-baseline gap-4"
                          distance={24}
                        >
                          <dt className="overline-sm-medium text-brandblue-500">
                            {row.label}
                          </dt>
                          <dd className="body-base-regular max-w-[64ch] text-slate-700">
                            {row.text}
                          </dd>
                        </StaggerItem>
                      ))}
                    </dl>
                  ) : (
                    <StaggerItem
                      as="p"
                      className="body-base-regular mt-4 max-w-[72ch] text-slate-700"
                      distance={28}
                    >
                      {c.approachText}
                    </StaggerItem>
                  )}
                </Stagger>

                {/* Results */}
                <Stagger
                  as="div"
                  className="mt-10 border-t border-grey-300 pt-6"
                  stagger={0.08}
                  amount={0.2}
                >
                  <StaggerItem
                    as="h3"
                    className="font-mono text-[12px] uppercase tracking-[0.18em] text-slate-900"
                    distance={20}
                  >
                    03 — {label("results")}
                  </StaggerItem>

                  <Stagger
                    as="ul"
                    className={`mt-5 grid gap-3.5 rounded-2xl bg-[#f4f6f8] p-6 lg:p-8 ${
                      c.results.length >= 4
                        ? "grid-cols-2 lg:grid-cols-4"
                        : "grid-cols-1 sm:grid-cols-3"
                    }`}
                    stagger={0.1}
                    delayChildren={0.1}
                    amount={0.2}
                  >
                    {c.results.map((r) => (
                      <StaggerItem
                        as="li"
                        key={r.value + r.unit}
                        distance={28}
                        blur={false}
                      >
                        <div className="flex h-full flex-col">
                          <CountUp
                            value={r.value}
                            className="text-[36px] font-mono font-bold  text-brandblue-500 lg:text-[44px]"
                          />
                          <p className="body-md-regular pt-3 max-w-[24ch] text-slate-500">
                            <span className="font-medium text-brandblue-500">
                              {r.unit}
                            </span>{" "}
                            {r.text}
                          </p>
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                </Stagger>

                {/* Quote */}
                {c.quote ? (
                  <Stagger
                    as="div"
                    className="mt-8 py-4 pe-8 border-s-4 border-brandblue-500 ps-7"
                    amount={0.25}
                  >
                    <StaggerItem distance={28}>
                      <figure>
                        <blockquote className="">
                          <p className="heading-lg-semibold text-brandblue-600 lg:text-[24px]">
                            {c.quote.text}
                          </p>
                        </blockquote>
                        <figcaption className="overline-md-medium pt-5 text-slate-700">
                          {c.quote.attribution}
                        </figcaption>
                      </figure>
                    </StaggerItem>
                  </Stagger>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
