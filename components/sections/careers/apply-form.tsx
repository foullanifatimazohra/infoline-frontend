"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Paperclip, X } from "lucide-react";
import { EASE } from "@/components/ui/motion/shared";
import Turnstile from "@/components/ui/forms/turnstile";
import Honeypot from "@/components/ui/forms/honeypot";
import { submitJobApplication } from "@/lib/forms/client";

/**
 * Job application form — REST /apply with CV upload (Phase 3 handover §5).
 *
 * Client-side checks mirror the API (PDF/DOC/DOCX, 5 MB max, text length
 * limits); the server is the source of truth and its field errors map by
 * name. Field copy is translated (server messages are English-only, so they
 * are never rendered directly on /ar).
 */

const MAX_CV_BYTES = 5 * 1024 * 1024;
const CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type Status = "idle" | "submitting" | "success";

export default function ApplicationForm({
  positions,
}: {
  /** Role titles the candidate can apply to (from the vacancies list). */
  positions: string[];
}) {
  const t = useTranslations("CareersPage.apply");
  const reduce = false;

  const [position, setPosition] = useState(positions[0] ?? "");

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  // `position` is the role title sent to the API (handover §4: taken from
  // the careers post/role the candidate is applying from).
  const [cv, setCv] = useState<File | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [turnstileToken, setTurnstileToken] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof typeof values, v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));
  const blur = (key: string) => setTouched((prev) => ({ ...prev, [key]: true }));

  const errorFor = (key: string): string | undefined => {
    if (fieldErrors[key]) return fieldErrors[key];
    if (!touched[key]) return undefined;
    switch (key) {
      case "name":
        return values.name.trim().length < 2 ? t("errors.name") : undefined;
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())
          ? undefined
          : t("errors.email");
      case "phone":
        return values.phone.trim().length >= 6 ? undefined : t("errors.phone");
      case "cv":
        return cv ? undefined : t("errors.cv");
      default:
        return undefined;
    }
  };

  const pickCv = (file: File | null) => {
    if (!file) return setCv(null);
    const okType =
      CV_TYPES.includes(file.type) ||
      /\.(pdf|docx?)$/i.test(file.name);
    if (!okType || file.size > MAX_CV_BYTES) {
      setTouched((p) => ({ ...p, cv: true }));
      setCv(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setCv(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, phone: true, cv: true });

    const errs: Record<string, string> = {};
    for (const k of ["name", "email", "phone", "cv"]) {
      const msg = errorFor(k);
      if (msg) errs[k] = msg;
    }
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    if (!cv) return;

    setStatus("submitting");
    setGeneralError(null);
    setFieldErrors({});

    try {
      const result = await submitJobApplication({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        position,
        message: values.message.trim() || undefined,
        cv,
        website: "",
        turnstileToken,
      });

      if (result.success) {
        setStatus("success");
        requestAnimationFrame(() =>
          successRef.current?.scrollIntoView({
            behavior: reduce ? "auto" : "smooth",
            block: "nearest",
          }),
        );
      } else {
        // Map server errors by field name; show OUR translated copy.
        const mapped: Record<string, string> = {};
        for (const errItem of result.validationErrors) {
          mapped[errItem.field === "email" ? "email" : errItem.field] =
            t(
              `errors.${errItem.field === "cv" ? "cv" : errItem.field}`,
            );
        }
        if (Object.keys(mapped).length > 0) {
          setFieldErrors(mapped);
        } else {
          setGeneralError(t("errors.general"));
        }
        setStatus("idle");
      }
    } catch {
      setGeneralError(t("errors.general"));
      setStatus("idle");
    }
  };

  const reset = () => {
    setValues({ name: "", email: "", phone: "", message: "" });
    setCv(null);
    setTouched({});
    setStatus("idle");
    setGeneralError(null);
    setFieldErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const err = (k: string) => errorFor(k) !== undefined;

  const inputBase =
    "w-full rounded-lg border bg-white px-4 py-3 text-[14.5px] text-slate-800 placeholder:text-slate-400 outline-none transition-[border-color,box-shadow] duration-200 focus:border-brandblue-400 focus:shadow-[0_0_0_3px_rgba(28,151,212,.14)]";
  const inputClass = (invalid?: boolean) =>
    `${inputBase} ${invalid ? "border-red-400" : "border-slate-200 hover:border-slate-300"}`;

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="success"
            ref={successRef}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="rounded-2xl bg-white p-10 shadow-[0_1px_2px_rgba(15,40,60,.04),0_18px_44px_-24px_rgba(15,40,60,.18)]"
          >
            <span className="mb-6 flex size-12 items-center justify-center rounded-full bg-emerald-50">
              <svg
                viewBox="0 0 24 24"
                className="size-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4.5 12.5l5 5L19.5 7" />
              </svg>
            </span>
            <h3 className="heading-lg-semibold text-slate-900">
              {t("successTitle")}
            </h3>
            <p className="body-lg-regular mt-3 max-w-[64ch] text-slate-600">
              {t("successDescription")}
            </p>
            <button
              type="button"
              onClick={reset}
              className="group mt-7 inline-flex items-center gap-2 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-brandblue-600"
            >
              {t("successAgain")}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="rounded-2xl bg-white p-8 shadow-[0_1px_2px_rgba(15,40,60,.04),0_18px_44px_-24px_rgba(15,40,60,.18)] lg:p-10"
          >
            <h3 className="heading-lg-semibold text-slate-900">{t("title")}</h3>

            <div className="mt-6">
              <label htmlFor="apply-position" className="mb-1.5 block text-[13.5px] font-medium text-slate-700">
                {t("role")}
              </label>
              <select
                id="apply-position"
                className={`${inputBase} border-slate-200 hover:border-slate-300 appearance-none pe-10`}
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              >
                {positions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <Honeypot />

            <div className="mt-7 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="apply-name" className="mb-1.5 block text-[13.5px] font-medium text-slate-700">
                  {t("name")}
                </label>
                <input
                  id="apply-name"
                  className={inputClass(err("name"))}
                  placeholder={t("namePlaceholder")}
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => blur("name")}
                  autoComplete="name"
                />
                {err("name") && (
                  <p role="alert" className="mt-1.5 text-[12.5px] font-medium text-red-600">
                    {errorFor("name")}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="apply-email" className="mb-1.5 block text-[13.5px] font-medium text-slate-700">
                  {t("email")}
                </label>
                <input
                  id="apply-email"
                  type="email"
                  dir="ltr"
                  className={inputClass(err("email"))}
                  placeholder={t("emailPlaceholder")}
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => blur("email")}
                  autoComplete="email"
                />
                {err("email") && (
                  <p role="alert" className="mt-1.5 text-[12.5px] font-medium text-red-600">
                    {errorFor("email")}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="apply-phone" className="mb-1.5 block text-[13.5px] font-medium text-slate-700">
                  {t("phone")}
                </label>
                <input
                  id="apply-phone"
                  type="tel"
                  dir="ltr"
                  className={inputClass(err("phone"))}
                  placeholder={t("phonePlaceholder")}
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  onBlur={() => blur("phone")}
                  autoComplete="tel"
                />
                {err("phone") && (
                  <p role="alert" className="mt-1.5 text-[12.5px] font-medium text-red-600">
                    {errorFor("phone")}
                  </p>
                )}
              </div>

              <div>
                <span className="mb-1.5 block text-[13.5px] font-medium text-slate-700">
                  {t("cv")}
                </span>
                <input
                  ref={fileInputRef}
                  id="apply-cv"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="sr-only"
                  onChange={(e) => pickCv(e.target.files?.[0] ?? null)}
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`inline-flex items-center gap-2.5 rounded-lg border px-4 py-3 text-[14px] font-medium transition-colors ${
                      err("cv")
                        ? "border-red-400 text-red-600"
                        : cv
                          ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-brandblue-300 hover:text-brandblue-600"
                    }`}
                  >
                    <Paperclip className="size-4" />
                    {cv ? cv.name : t("cvButton")}
                    {cv && (
                      <X
                        aria-hidden
                        className="size-3.5 opacity-60"
                        onClick={(e) => {
                          e.stopPropagation();
                          pickCv(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      />
                    )}
                  </button>
                  <span className="text-[12px] text-slate-400">{t("cvHint")}</span>
                </div>
                {err("cv") && (
                  <p role="alert" className="mt-1.5 text-[12.5px] font-medium text-red-600">
                    {errorFor("cv")}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="apply-message" className="mb-1.5 block text-[13.5px] font-medium text-slate-700">
                {t("message")}
              </label>
              <textarea
                id="apply-message"
                rows={4}
                className={`${inputBase} border-slate-200 hover:border-slate-300 resize-none`}
                placeholder={t("messagePlaceholder")}
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
              />
            </div>

            {generalError && (
              <p
                role="alert"
                className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700"
              >
                {generalError}
              </p>
            )}

            <Turnstile onToken={setTurnstileToken} className="mt-6" />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="group mt-7 inline-flex items-center gap-2.5 rounded-md bg-brandblue-500 px-7 py-4 text-[12.5px] font-semibold uppercase tracking-[0.11em] text-white shadow-[0_8px_24px_-12px_rgba(28,151,212,.9)] transition-[background,box-shadow,transform] duration-300 [transition-timing-function:cubic-bezier(.16,1,.3,1)] hover:bg-brandblue-600 hover:shadow-[0_16px_34px_-14px_rgba(28,151,212,1)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "submitting" ? t("submitting") : t("submit")}
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
