
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
import { useScrollSpy } from '@/hooks/use-scrollspy';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/#home', id: 'home', icon: <Home className="h-full w-full" /> },
  { name: 'About', href: '/#about', id: 'about', icon: <User className="h-full w-full" /> },
  { name: 'Achievements', href: '/#achievements', id: 'achievements', icon: <Award className="h-full w-full" /> },
  { name: 'Gallery', href: '/#gallery', id: 'gallery', icon: <Images className="h-full w-full" /> },
  { name: 'Media', href: '/media', id: 'media-hub', icon: <Newspaper className="h-full w-full" /> },
  { name: 'Testimonials', href: '/#testimonials', id: 'testimonials', icon: <MessageSquare className="h-full w-full" /> },
  { name: 'Courses', href: '/#courses', id: 'courses', icon: <FileText className="h-full w-full" /> },
  { name: 'Contact', href: '/#contact', id: 'contact', icon: <Phone className="h-full w-full" /> },
];

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const pathname = usePathname();

  // Use the scroll spy hook only on the homepage
  const isHomePage = pathname === '/';
  const activeId = useScrollSpy(navLinks.map(l => l.id), {
    rootMargin: '0% 0% -80% 0%',
    enabled: isHomePage,
  });


  return (
    <div className="fixed bottom-4 left-0 right-0 z-50">
       <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="mx-auto flex h-16 items-end gap-4 rounded-2xl glassmorphism px-4 pb-3"
      >
        {navLinks.map((link) => (
          <AppIcon
            href={link.href}
            name={link.name}
            isActive={link.id === activeId}
            mouseX={mouseX}
            key={link.href}
          >
            {link.icon}
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
  isActive,
  children,
}: {
  mouseX: any;
  href: string;
  name: string;
  isActive: boolean;
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
      className={cn(
        "aspect-square w-10 cursor-pointer rounded-full flex items-center justify-center transition-colors duration-300",
        isActive ? "bg-primary" : "bg-secondary/80 hover:bg-secondary"
        )}
      aria-label={name}
      title={name}
    >
        <Link href={href} className={cn("w-1/2 h-1/2", isActive ? "text-primary-foreground" : "text-primary")}>
            {children}
        </Link>
    </motion.div>
  );
}
