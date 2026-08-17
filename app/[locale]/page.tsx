import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("homePage");
  return (
    <h1 className="heading-hero-semibold text-brandblue-500">{t("title")}</h1>
  );
}
