"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { MaskText, Stagger, StaggerItem } from "@/components/ui/motion";
import { EASE } from "@/components/ui/motion/shared";

type FaqItem = { q: string; a: string };

export default function Faq() {
  const t = useTranslations("SolutionsPage");
  const items = t.raw("faq.items") as FaqItem[];
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-slate-25 py-6xl">
      <div className="mx-auto w-full max-w-360 px-6 lg:px-10">
        <Stagger
          as="div"
          className="mb-4xl flex flex-col gap-lg"
          stagger={0.15}
        >
          <StaggerItem>
            <p className="overline-sm-medium mb-sm text-slate-400">
              {t("faq.eyebrow")}
            </p>
            <MaskText
              as="h2"
              className="heading-2xl-semibold max-w-[22ch] text-slate-900"
              segments={[{ text: t("faq.title") }]}
              amount={0.5}
              duration={0.8}
            />
          </StaggerItem>
        </Stagger>

        <Stagger as="div" className="mx-auto" stagger={0.08}>
          {items.map((item, i) => {
            const isOpen = i === open;
            return (
              <StaggerItem
                as="div"
                key={item.q}
                className="border-b border-slate-100"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-start"
                >
                  <span className="body-xl-semibold text-slate-900">
                    {item.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={
                      reduce ? { duration: 0 } : { duration: 0.3, ease: EASE }
                    }
                    className="shrink-0 text-brandblue-500"
                  >
                    <Plus className="size-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={
                        reduce ? { opacity: 1 } : { height: 0, opacity: 0 }
                      }
                      animate={
                        reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }
                      }
                      exit={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="body-lg-regular pb-6 text-slate-600">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
