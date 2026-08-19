"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

type MotionStaggerGroupProps = {
  children: ReactNode;
  className?: string;
  /** Espera entre la aparición de cada hijo (MotionStaggerItem), en segundos. */
  staggerDelay?: number;
  /** Retraso antes de que empiece el primer hijo. */
  delay?: number;
  trigger?: "mount" | "viewport";
};

/**
 * Orquesta una secuencia única de aparición para sus hijos MotionStaggerItem
 * (por ejemplo: eyebrow → H1 → subtítulo, o las tarjetas de zona). No
 * modifica el layout: solo coordina el "cuándo" de la animación de entrada.
 */
export function MotionStaggerGroup({
  children,
  className,
  staggerDelay = 0.08,
  delay = 0,
  trigger = "mount",
}: MotionStaggerGroupProps) {
  const reduceMotion = useReducedMotion();

  const container = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { staggerChildren: 0, delayChildren: 0 }
        : { staggerChildren: staggerDelay, delayChildren: delay },
    },
  };

  if (trigger === "viewport") {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={container}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {children}
    </motion.div>
  );
}

type MotionStaggerItemProps = {
  children: ReactNode;
  className?: string;
  y?: number;
};

/** Hijo animado de MotionStaggerGroup: fade + desplazamiento sutil. */
export function MotionStaggerItem({
  children,
  className,
  y = 12,
}: MotionStaggerItemProps) {
  const reduceMotion = useReducedMotion();

  const item = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y },
    visible: reduceMotion
      ? { opacity: 1, transition: { duration: 0.25 } }
      : { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
  };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
