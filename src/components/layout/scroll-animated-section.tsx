'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

interface ScrollAnimatedSectionProps {
  children: ReactNode;
  className?: string;
}

export default function ScrollAnimatedSection({ children, className }: ScrollAnimatedSectionProps) {

  const variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      variants={variants}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
