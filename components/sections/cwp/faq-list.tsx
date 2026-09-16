"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { EASE } from "@/components/ui/motion/shared";

/**
 * FAQ accordion for the CMS templates (serviceProof.faqs,
 * industryCoreContent.securityFaqs) — same interaction as the solutions
 * page FAQ, fed by CMS data. First item open by default.
 */
export default function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(0);

  if (!items.length) return null;

  return (
    <Stagger as="div" className="mx-auto" stagger={0.08}>
      {items.map((item, i) => {
        const isOpen = i === open;
        return (
          <StaggerItem as="div" key={item.question} className="border-b border-slate-100">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-start"
            >
              <span className="body-xl-semibold text-slate-900">{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={reduce ? { duration: 0 } : { duration: 0.3, ease: EASE }}
                className="shrink-0 text-brandblue-500"
              >
                <Plus className="size-5" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="body-lg-regular max-w-[70ch] pb-6 text-slate-600">
                    {item.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
