"use client"

import type { ReactNode } from "react"
import { motion } from "motion/react"
import type { Variants } from "motion/react"

type Direction = "up" | "down" | "left" | "right" | "none"

const offset = 48

function buildVariants(direction: Direction): Variants {
  const hidden: Record<string, number> = { opacity: 0 }
  if (direction === "up") hidden.y = offset
  if (direction === "down") hidden.y = -offset
  if (direction === "left") hidden.x = offset
  if (direction === "right") hidden.x = -offset

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  }
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  className,
  once = true,
}: {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}) {
  return (
    <motion.div
      className={className}
      variants={buildVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
