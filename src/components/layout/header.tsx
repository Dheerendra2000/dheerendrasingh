
"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"
import { useScrollSpy } from "@/hooks/use-scrollspy"
import { usePathname } from "next/navigation"

const navLinks = [
  { name: "Home", href: "/#home", id: "home" },
  { name: "About", href: "/#about", id: "about" },
  { name: "Achievements", href: "/#achievements", id: "achievements" },
  { name: "Gallery", href: "/#gallery", id: "gallery" },
  { name: "Media", href: "/media", id: "media-hub" },
  { name: "Testimonials", href: "/#testimonials", id: "testimonials" },
  { name: "Courses", href: "/#courses", id: "courses" },
]

function HeaderLink({
  link,
  isActive,
  mouseY,
}: {
  link: { name: string; href: string; id: string };
  isActive: boolean;
  mouseY: any;
}) {
  const ref = React.useRef<HTMLAnchorElement>(null);

  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  const scaleSync = useTransform(distance, [-100, 0, 100], [1, 1.25, 1]);
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div style={{ scale }}>
        <Link
            ref={ref}
            href={link.href}
            className={cn(
                "font-medium transition-transform,colors",
                isActive ? "text-primary font-bold" : "text-foreground/80 hover:text-primary"
            )}
            >
            {link.name}
        </Link>
    </motion.div>
  );
}


export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const mouseY = useMotionValue(Infinity);

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
        return pathname.includes(linkId);
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
             className="hidden md:flex items-center gap-2"
             onMouseMove={(e) => mouseY.set(e.pageY)}
             onMouseLeave={() => mouseY.set(Infinity)}
           >
            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <HeaderLink
                  key={link.href}
                  link={link}
                  isActive={isLinkActive(link.id)}
                  mouseY={mouseY}
                />
              ))}
            </nav>
            <div className="flex items-center gap-2 ml-6">
                <Button asChild>
                <Link href="/#contact">Contact</Link>
                </Button>
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
