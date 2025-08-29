
'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { type ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="relative">
      <motion.div 
        className="aurora-bg"
        style={{ y }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
