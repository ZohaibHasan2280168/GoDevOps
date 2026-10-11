"use client"
import { AnimatePresence, motion } from "framer-motion"
import { useLocation } from "react-router-dom"

const pageVariants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.98
  },
  in: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    x: -100,
    scale: 0.98
  }
}

const pageTransition = {
  type: "tween",
  ease: [0.22, 0.9, 0.36, 1],
  duration: 0.4
}

export default function PageTransition({ children }) {
  const pathname = usePathname()
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
