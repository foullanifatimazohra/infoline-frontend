"use client";

import { useTranslations } from "next-intl";
import { Reveal } from "@/components/ui/motion";
import ApplicationForm from "./apply-form";

/**
 * Apply — the job application form section (REST /apply with CV upload).
 * Roles come from the same static vacancy list as the table above, so
 * `position` always matches a real role title (Phase 3 handover §4).
 * Vacancy rows deep-link here via #apply.
 */
export default function Apply() {
  const t = useTranslations("CareersPage");
  const roles = t.raw("vacancies.roles") as { title: string }[];
  const positions = roles.map((r) => r.title);

  return (
    <section id="apply" className="scroll-mt-24 bg-slate-25 py-10 lg:py-15">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <Reveal amount={0.25}>
          <ApplicationForm positions={positions} />
        </Reveal>
      </div>
    </section>
  );
}
