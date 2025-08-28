import { Linkedin, Twitter, Youtube } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export default function Footer() {
  return (
    <footer className="bg-transparent text-secondary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-2xl font-headline font-bold text-primary">Dheerendra Singh</h3>
            <p className="text-sm text-muted-foreground">Public Speaker & Branding Specialist</p>
          </div>
          <div className="flex space-x-4 mb-4 md:mb-0">
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Dheerendra Singh. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
