import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ProviderQueryWrapper } from "@/providers";
import { Header } from "@/components/layout/header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Infoline App",
  description: "Infoline app description",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${ibmPlexSansArabic.variable} h-full antialiased`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <body className={locale === "ar" ? "font-arabic" : "font-latin"}>
        <NextIntlClientProvider>
          <ProviderQueryWrapper>
            <Header />
            {children}
          </ProviderQueryWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
