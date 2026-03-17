import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function RevealSection({ children, className = "" }) {
  return (
    <motion.section
      className={`reveal-section ${className}`.trim()}
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      viewport={{ once: false, amount: 0.18 }}
      transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
    >
      {children}
    </motion.section>
  )
}
