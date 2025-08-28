import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Award, Megaphone, Newspaper, Terminal, type LucideIcon } from "lucide-react"
import { getAchievementsContent } from "@/lib/data/achievements"
import { Alert, AlertTitle, AlertDescription } from "../ui/alert"

// Map string names to Lucide icon components
const iconMap: { [key: string]: LucideIcon } = {
  Award,
  Megaphone,
  Newspaper,
}

export default async function AchievementsSection() {
  const { achievements, error } = await getAchievementsContent();
  
  if (error) {
    return (
      <section id="achievements" className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
           <Alert variant="destructive" className="glassmorphism">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Action Required: Configuration Error</AlertTitle>
            <AlertDescription>
              <p className="font-semibold">The 'Achievements' section cannot connect to the database.</p>
              <code className="mt-2 relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {error}
              </code>
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">My Achievements</h2>
          <p className="text-lg text-muted-foreground mt-2">A track record of success and recognition</p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 h-full w-px bg-border/50 -translate-x-1/2 hidden md:block"></div>
          {achievements.map((item, index) => {
            const IconComponent = iconMap[item.icon] || Award; // Default to Award icon if not found
            return (
              <div key={item.id} className="mb-8 flex justify-center md:justify-normal items-center w-full">
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:ml-auto md:text-left'}`}>
                  <div className="relative">
                    <div className="absolute top-1/2 -mt-4 hidden md:block w-8 h-8 rounded-full bg-primary border-4 border-background right-0 translate-x-[18px] md:left-auto">
                      {index % 2 !== 0 && <div className="absolute top-1/2 -mt-4 w-8 h-8 rounded-full bg-primary border-4 border-background left-0 -translate-x-[18px]"></div>}
                    </div>
                    <Card className="shadow-lg transform hover:scale-105 transition-transform duration-300">
                      <CardHeader>
                        <div className={`flex items-center gap-4 mb-2 justify-center ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                          <div className={`flex items-center gap-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                             <IconComponent className="h-8 w-8 text-accent flex-shrink-0" />
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
