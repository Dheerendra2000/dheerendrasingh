'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface ScrollAnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollAnimatedSection({ children, className }: ScrollAnimatedSectionProps) {

  const variants = {
    hidden: { 
      opacity: 0,
      rotateX: -20, // Start with a tilt
      y: 50,
      transformOrigin: 'top',
    },
    visible: { 
      opacity: 1,
      rotateX: 0,   // Animate to flat
      y: 0,
      transformOrigin: 'top',
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -150px 0px" }}
      variants={variants}
      transition={{ duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }} // A smoother, more refined easing
      className={className}
    >
      {children}
    </motion.div>
  );
}
