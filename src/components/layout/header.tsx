
"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Home, User, Award, Images, Newspaper, MessageSquare, FileText, Phone } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"
import { useScrollSpy } from "@/hooks/use-scrollspy"
import { usePathname } from "next/navigation"

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

function HeaderIcon({
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
  const ref = React.useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // The widthSync transformation creates the "magnetic" bubble effect.
  // The icon grows to 60px when the cursor is directly over it and shrinks back to 32px when it's 100px away.
  const widthSync = useTransform(distance, [-100, 0, 100], [32, 60, 32]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        "aspect-square w-8 cursor-pointer rounded-full flex items-center justify-center transition-colors duration-300",
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


export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const mouseX = useMotionValue(Infinity);

  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const activeId = useScrollSpy(navLinks.map(l => l.id), {
    rootMargin: '0% 0% -80% 0%',
    enabled: isHomePage,
  });


  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll() // set initial state
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMenu = () => setMobileMenuOpen(false)

  const isLinkActive = (linkId: string) => {
    if (pathname !== '/') {
        // Special case for media page
        if (linkId === 'media-hub') {
            return pathname.startsWith('/media');
        }
        return false;
    }
    return activeId === linkId;
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "glassmorphism shadow-lg" : "border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold font-headline text-primary">
              Dheerendra Singh
            </span>
          </Link>

          {/* Desktop Navigation */}
           <motion.div 
             className="hidden md:flex items-center justify-center gap-4"
             onMouseMove={(e) => mouseX.set(e.pageX)}
             onMouseLeave={() => mouseX.set(Infinity)}
           >
            {navLinks.map((link) => (
                <HeaderIcon
                    href={link.href}
                    name={link.name}
                    isActive={isLinkActive(link.id)}
                    mouseX={mouseX}
                    key={link.href}
                >
                    {link.icon}
                </HeaderIcon>
            ))}
             <div className="flex items-center gap-2 ml-4">
                <ThemeToggle />
            </div>
          </motion.div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full bg-background/95 backdrop-blur-lg">
                <div className="flex justify-between items-center p-4 border-b">
                   <Link href="/" onClick={closeMenu}>
                    <span className="text-xl font-bold font-headline text-primary">
                      Dheerendra Singh
                    </span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={closeMenu}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <div className="flex flex-col space-y-4 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "text-lg transition-colors",
                         isLinkActive(link.id) ? "text-primary font-bold" : "text-foreground/80 hover:text-primary"
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Button asChild className="w-full">
                    <Link href="/#contact" onClick={closeMenu}>Contact</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
