
'use client';

import {
  Home,
  User,
  Award,
  Images,
  Newspaper,
  MessageSquare,
  FileText,
  Phone,
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

const navLinks = [
  { name: 'Home', href: '/', icon: <Home className="h-full w-full" /> },
  { name: 'About', href: '/#about', icon: <User className="h-full w-full" /> },
  { name: 'Achievements', href: '/#achievements', icon: <Award className="h-full w-full" /> },
  { name: 'Gallery', href: '/#gallery', icon: <Images className="h-full w-full" /> },
  { name: 'Media', href: '/media', icon: <Newspaper className="h-full w-full" /> },
  { name: 'Testimonials', href: '/#testimonials', icon: <MessageSquare className="h-full w-full" /> },
  { name: 'Courses', href: '/#courses', icon: <FileText className="h-full w-full" /> },
  { name: 'Contact', href: '/#contact', icon: <Phone className="h-full w-full" /> },
];

export default function Dock() {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50">
       <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="mx-auto flex h-16 items-end gap-4 rounded-2xl glassmorphism px-4 pb-3"
      >
        {navLinks.map(({ name, href, icon }) => (
          <AppIcon
            href={href}
            name={name}
            mouseX={mouseX}
            key={href}
          >
            {icon}
          </AppIcon>
        ))}
      </motion.div>
    </div>
  );
};


function AppIcon({
  mouseX,
  href,
  name,
  children,
}: {
  mouseX: any;
  href: string;
  name: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className="aspect-square w-10 cursor-pointer rounded-full bg-secondary/80 flex items-center justify-center"
      aria-label={name}
      title={name}
    >
        <Link href={href} className="w-1/2 h-1/2 text-primary">
            {children}
        </Link>
    </motion.div>
  );
}
