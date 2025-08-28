import { getCoursesContent } from "@/lib/data/courses"
import { Terminal } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import CourseCard from "./course-card"

export default async function CoursesSection() {
  const { courses, error } = await getCoursesContent();

  if (error) {
    return (
      <section id="courses" className="py-20 bg-transparent">
        <div className="container mx-auto px-4">
           <Alert variant="destructive" className="glassmorphism">
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
    <section id="courses" className="py-20 bg-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">My Courses</h2>
          <p className="text-lg text-muted-foreground mt-2">Invest in yourself and unlock your potential</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}
