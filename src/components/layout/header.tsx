
"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X, Home, User, Award, Images, Newspaper, MessageSquare, FileText, Phone } from "lucide-react"
import { motion } from 'framer-motion';

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"
import { useScrollSpy } from "@/hooks/use-scrollspy"
import { usePathname } from "next/navigation"

const navLinks = [
  { name: 'Home', href: '/#home', id: 'home', icon: <Home className="h-4 w-4" /> },
  { name: 'About', href: '/#about', id: 'about', icon: <User className="h-4 w-4" /> },
  { name: 'Achievements', href: '/#achievements', id: 'achievements', icon: <Award className="h-4 w-4" /> },
  { name: 'Gallery', href: '/#gallery', id: 'gallery', icon: <Images className="h-4 w-4" /> },
  { name: 'Media', href: '/media', id: 'media-hub', icon: <Newspaper className="h-4 w-4" /> },
  { name: 'Testimonials', href: '/#testimonials', id: 'testimonials', icon: <MessageSquare className="h-4 w-4" /> },
  { name: 'Courses', href: '/#courses', id: 'courses', icon: <FileText className="h-4 w-4" /> },
  { name: 'Contact', href: '/#contact', id: 'contact', icon: <Phone className="h-4 w-4" /> },
];

function NavLink({
  href,
  name,
  isActive,
  children,
}: {
  href: string;
  name: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="relative px-3 py-2 transition-colors" aria-current={isActive ? "page" : undefined}>
        <motion.span 
          className={cn(
            "relative z-10 flex items-center gap-2",
            isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
          )}
        >
            {children}
            <span>{name}</span>
        </motion.span>
        {isActive && (
            <motion.div
                layoutId="header-active-link"
                className="absolute inset-0 bg-primary/10 rounded-md"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
    </Link>
  );
}


export default function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

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
             className="hidden md:flex items-center justify-center gap-2"
           >
            {navLinks.map((link) => (
                <NavLink
                    href={link.href}
                    name={link.name}
                    isActive={isLinkActive(link.id)}
                    key={link.href}
                >
                    {link.icon}
                </NavLink>
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
