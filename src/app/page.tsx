import Dock from '@/components/layout/dock'
import Footer from '@/components/layout/footer'
import HeroSection from '@/components/sections/hero'
import AboutSection from '@/components/sections/about'
import AchievementsSection from '@/components/sections/achievements'
import GallerySection from '@/components/sections/gallery'
import TestimonialsSection from '@/components/sections/testimonials'
import CoursesSection from '@/components/sections/courses'
import ContactSection from '@/components/sections/contact'
import MediaCoverageSection from '@/components/sections/media-coverage'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Dock />
      <main className="flex-grow">
        <HeroSection />
        <div id="home" className="absolute top-0" />
        <AboutSection />
        <AchievementsSection />
        <GallerySection />
        <MediaCoverageSection />
        <TestimonialsSection />
        <CoursesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
