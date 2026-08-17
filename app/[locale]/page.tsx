import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("homePage");
  return <h1 className="text-3xl">{t("title")}</h1>;
}
