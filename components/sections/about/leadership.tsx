import { useTranslations } from "next-intl";
import Image from "next/image";
import { MaskText, Stagger, StaggerItem } from "@/components/ui/motion";

type Person = { name: string; title: string; image: string };

function PersonCard({
  person,
  featured,
}: {
  person: Person;
  featured?: boolean;
}) {
  return (
    <StaggerItem className="flex flex-col items-center text-center">
      <div
        className={`relative size-28 overflow-hidden rounded-full lg:size-32 ${
          featured
            ? " ring-offset-2 ring-offset-white"
            : "ring-1 ring-slate-900/10"
        }`}
      >
        <Image
          src={person.image}
          alt={person.name}
          fill
          sizes="128px"
          className="object-cover"
        />
      </div>
      <p className="mt-4 body-lg-semibold text-slate-900">{person.name}</p>
      <p className="mt-1 max-w-[20ch] body-sm-regular text-brandblue-500">
        {person.title}
      </p>
    </StaggerItem>
  );
}

/** Dashed container with a label straddling the top border, like a "boxed section" tag. */
function DashedSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative mt-16 rounded-3xl border border-dashed border-[#ABD7ED] px-6 pb-10 pt-8 lg:px-10">
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-white px-4 overline-sm-medium text-slate-400">
        {label}
      </span>
      {children}
    </div>
  );
}

/**
 * Leadership — Board of Directors (5) and Executive Leadership (CEO + 3), shown as
 * circular headshots. The CEO card carries a brand ring to read as the lead.
 */
export default function Leadership() {
  const t = useTranslations("AboutPage");
  const board = t.raw("leadership.board") as Person[];
  const ceo = t.raw("leadership.ceo") as Person;
  const executives = t.raw("leadership.executives") as Person[];

  return (
    <section className="bg-white py-24 text-ink lg:py-32">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <div className="flex items-center flex-col text-center">
          <p className="overline-sm-medium text-slate-400">
            {t("leadership.eyebrow")}
          </p>
          <MaskText
            as="h2"
            className="mt-4 heading-2xl-semibold text-slate-900"
            segments={[{ text: t("leadership.title") }]}
            amount={0.5}
            duration={0.85}
          />
          <p className="mt-5 max-w-[46ch] body-lg-regular text-slate-600">
            {t("leadership.description")}
          </p>
        </div>

        {/* Board of Directors */}
        <DashedSection label={t("leadership.boardLabel")}>
          <Stagger
            as="div"
            className="grid grid-cols-2 lg:p-7 p-4 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
            stagger={0.09}
            amount={0.2}
          >
            {board.map((person) => (
              <PersonCard key={person.name} person={person} />
            ))}
          </Stagger>
        </DashedSection>

        {/* Executive Leadership */}
        <div className="lg:p-20">
          <DashedSection label={t("leadership.execLabel")}>
            <Stagger
              as="div"
              className="flex lg:p-7 p-2 flex-col items-center gap-y-12"
              stagger={0.09}
              amount={0.2}
            >
              <PersonCard person={ceo} featured />
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
                {executives.map((person) => (
                  <PersonCard key={person.name} person={person} />
                ))}
              </div>
            </Stagger>
          </DashedSection>
        </div>
      </div>
    </section>
  );
}
