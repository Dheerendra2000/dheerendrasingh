import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Award, Megaphone, Newspaper } from "lucide-react"

const achievements = [
  {
    icon: Award,
    year: "2023",
    title: "Speaker of the Year Award",
    description: "Recognized for outstanding and impactful keynote speeches at the National Speakers Conference.",
  },
  {
    icon: Megaphone,
    year: "2022",
    title: "Lead 'BrandU' Campaign",
    description: "Led a successful nationwide PR campaign that increased client visibility by 300%.",
  },
  {
    icon: Newspaper,
    year: "2021",
    title: "Forbes Magazine Feature",
    description: "Featured in an article on 'Top 10 Branding Gurus to Watch'.",
  },
  {
    icon: Award,
    year: "2020",
    title: "Excellence in Communication Award",
    description: "Awarded by the Public Relations Society for innovative communication strategies.",
  },
]

export default function AchievementsSection() {
  return (
    <section id="achievements" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">My Achievements</h2>
          <p className="text-lg text-muted-foreground mt-2">A track record of success and recognition</p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 h-full w-1 bg-border -translate-x-1/2 hidden md:block"></div>
          {achievements.map((item, index) => (
            <div key={index} className="mb-8 flex justify-center md:justify-normal items-center w-full">
              <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto md:text-left'}`}>
                <div className="relative">
                  <div className="absolute top-1/2 -mt-4 hidden md:block w-8 h-8 rounded-full bg-primary border-4 border-secondary right-0 translate-x-[18px] md:left-auto">
                    {index % 2 !== 0 && <div className="absolute top-1/2 -mt-4 w-8 h-8 rounded-full bg-primary border-4 border-secondary left-0 -translate-x-[18px]"></div>}
                  </div>
                  <Card className="shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <CardHeader>
                      <div className={`flex items-center gap-4 mb-2 justify-center ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                        <div className={`flex items-center gap-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                           <item.icon className="h-8 w-8 text-accent flex-shrink-0" />
                           <CardTitle>{item.title}</CardTitle>
                        </div>
                      </div>
                      <p className="font-bold text-accent">{item.year}</p>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
