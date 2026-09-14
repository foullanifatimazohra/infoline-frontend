import { useTranslations } from "next-intl";
import Image from "next/image";
import { MaskText, Reveal, Stagger, StaggerItem } from "@/components/ui/motion";

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
            ? "ring-2 ring-brandblue-500 ring-offset-2 ring-offset-white"
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
        <Reveal
          as="p"
          direction="up"
          distance={20}
          duration={0.7}
          className="mt-16 overline-sm-medium text-slate-400"
        >
          {t("leadership.boardLabel")}
        </Reveal>
        <Stagger
          as="div"
          className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5"
          stagger={0.09}
          amount={0.2}
        >
          {board.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </Stagger>

        {/* Executive Leadership */}
        <Reveal
          as="p"
          direction="up"
          distance={20}
          duration={0.7}
          className="mt-16 overline-sm-semibold text-slate-400"
        >
          {t("leadership.execLabel")}
        </Reveal>
        <Stagger
          as="div"
          className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4"
          stagger={0.09}
          amount={0.2}
        >
          <PersonCard person={ceo} featured />
          {executives.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
