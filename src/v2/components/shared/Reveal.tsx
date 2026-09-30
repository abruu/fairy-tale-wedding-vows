import React, { useMemo } from "react";
import { motion, type TargetAndTransition, type Variants } from "framer-motion";
import { fadeRise, motionVariants } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds — for staggering siblings */
  delay?: number;
}

/** Fades + rises its children in the first time they scroll into view. */
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0 }) => {
  const prefersReduced = useReducedMotion();
  const variants = useMemo<Variants>(() => {
    const base = motionVariants(prefersReduced, fadeRise);
    if (!delay) return base;
    // A variant's own transition wins over the `transition` prop, so the delay goes in here.
    const show = base.show as TargetAndTransition;
    return { ...base, show: { ...show, transition: { ...show.transition, delay } } };
  }, [prefersReduced, delay]);

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      // "some" (not a ratio) so very tall blocks on phones still trigger
      viewport={{ once: true, amount: "some", margin: "0px 0px -40px 0px" }}
    >
      {children}
    </motion.div>
  );
};
