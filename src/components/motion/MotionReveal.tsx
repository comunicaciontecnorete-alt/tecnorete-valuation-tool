"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  /** Retraso antes de iniciar la animación, en segundos. */
  delay?: number;
  /** Desplazamiento vertical inicial en px. */
  y?: number;
  duration?: number;
  /**
   * "mount": se anima al montar el componente (uso en el hero, por encima
   * del pliegue, donde el usuario ve la animación al cargar la página).
   * "viewport": se anima una única vez al entrar en el viewport (contenido
   * más abajo en la página, revelado sutil al hacer scroll).
   */
  trigger?: "mount" | "viewport";
};

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Envoltorio visual de entrada (opacity + desplazamiento sutil) reutilizado
 * en todo el rediseño TECNORETE. No añade ninguna lógica funcional: solo
 * anima la aparición del contenido que recibe como children.
 *
 * Respeta prefers-reduced-motion mediante useReducedMotion: si el usuario
 * ha solicitado reducir movimiento, se elimina el desplazamiento y solo
 * queda un fundido (fade) mínimo.
 */
export function MotionReveal({
  children,
  className,
  delay = 0,
  y = 14,
  duration = 0.5,
  trigger = "mount",
}: MotionRevealProps) {
  const reduceMotion = useReducedMotion();

  const hidden = reduceMotion ? { opacity: 0 } : { opacity: 0, y };
  const visible = reduceMotion
    ? { opacity: 1, transition: { duration: 0.25, delay } }
    : { opacity: 1, y: 0, transition: { duration, delay, ease: EASE } };

  if (trigger === "viewport") {
    return (
      <motion.div
        className={className}
        initial={hidden}
        whileInView={visible}
        viewport={{ once: true, margin: "-80px" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div className={className} initial={hidden} animate={visible}>
      {children}
    </motion.div>
  );
}
