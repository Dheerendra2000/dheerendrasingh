import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCoursesContent } from "@/lib/data/courses"
import { Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"

export default async function CoursesSection() {
  const { courses, error } = await getCoursesContent();

  if (error) {
    return (
      <section id="courses" className="py-20 bg-background">
        <div className="container mx-auto px-4">
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Action Required: Configuration Error</AlertTitle>
            <AlertDescription>
              <p className="font-semibold">The 'Courses' section cannot connect to the database.</p>
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
    <section id="courses" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">My Courses</h2>
          <p className="text-lg text-muted-foreground mt-2">Invest in yourself and unlock your potential</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <div className="relative">
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  data-ai-hint={course.hint}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                />
                <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">{course.category}</Badge>
              </div>
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow" />
              <CardFooter className="flex justify-between items-center">
                <p className="text-2xl font-bold text-primary">{course.price}</p>
                <Button asChild>
                  <a href={course.link}>Learn More</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
