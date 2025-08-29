'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isgrabbing, setIsGrabbing] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const springConfig = {
    damping: 30,
    stiffness: 700,
    mass: 0.5,
  };

  const mouse = {
    x: useSpring(0, springConfig),
    y: useSpring(0, springConfig),
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x.set(e.clientX);
      mouse.y.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsGrabbing(true);
    const handleMouseUp = () => setIsGrabbing(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseover', handleMouseOver);
    document.body.addEventListener('mousedown', handleMouseDown);
    document.body.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseover', handleMouseOver);
      document.body.removeEventListener('mousedown', handleMouseDown);
      document.body.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouse.x, mouse.y]);

  const cursorSize = isHovering ? 50 : 30;

  const cursorVariants = {
    default: {
      opacity: 1,
      height: cursorSize,
      width: cursorSize,
      x: mouse.x,
      y: mouse.y,
      transition: {
        type: 'spring',
        mass: 0.6,
      },
    },
    grabbing: {
      scale: 0.9,
    },
    hidden: {
      opacity: 0,
      scale: 0,
    },
  };
  
  const dotVariants = {
    default: {
      opacity: 1,
      x: mouse.x,
      y: mouse.y,
    },
    hovering: {
      scale: 2,
      opacity: 0.5,
    },
    hidden: {
      opacity: 0,
      scale: 0,
    },
  };

  return (
    <>
      <motion.div
        variants={cursorVariants}
        animate={isHidden ? 'hidden' : isgrabbing ? 'grabbing' : 'default'}
        className="pointer-events-none fixed left-0 top-0 z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary"
      />
      <motion.div
        variants={dotVariants}
        animate={isHidden ? 'hidden' : isHovering ? 'hovering' : 'default'}
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full",
          isHovering ? "bg-transparent" : "bg-primary"
        )}
      />
    </>
  );
}
