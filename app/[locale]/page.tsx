import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("homePage");
  return <h1>{t("title")}</h1>;
}
