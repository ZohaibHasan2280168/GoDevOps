// Animation variants and utilities for Framer Motion

export const pageTransition = {
  type: "tween",
  ease: [0.22, 0.9, 0.36, 1],
  duration: 0.4
}

export const pageVariants = {
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

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 0.9, 0.36, 1]
    }
  }
}

export const buttonHover = {
  scale: 1.03,
  transition: { duration: 0.15 }
}

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 }
}

export const cardHover = {
  y: -5,
  transition: { duration: 0.2 }
}

export const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(14, 165, 233, 0.3)",
      "0 0 30px rgba(14, 165, 233, 0.6)",
      "0 0 20px rgba(14, 165, 233, 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Stagger animation for lists
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Loading skeleton animation
export const skeletonVariants = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

// Success checkmark animation
export const checkmarkVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.5, ease: "easeInOut" },
      opacity: { duration: 0.2 }
    }
  }
}