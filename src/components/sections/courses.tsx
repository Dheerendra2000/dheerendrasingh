import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const courses = [
  {
    title: "Mastering Public Speaking",
    description: "Conquer your fear of public speaking and learn to deliver powerful, persuasive presentations.",
    thumbnail: "https://placehold.co/600x400.png",
    hint: "presentation stage",
    price: "$299",
    category: "Communication",
    link: "#",
  },
  {
    title: "Personal Branding Blueprint",
    description: "Craft a compelling personal brand that opens doors to new opportunities and establishes you as a thought leader.",
    thumbnail: "https://placehold.co/600x400.png",
    hint: "personal branding",
    price: "$349",
    category: "Branding",
    link: "#",
  },
  {
    title: "PR & Media Relations Mastery",
    description: "Learn how to effectively engage with the media, manage your public image, and secure positive press coverage.",
    thumbnail: "https://placehold.co/600x400.png",
    hint: "media interview",
    price: "$499",
    category: "PR",
    link: "#",
  },
]

export default function CoursesSection() {
  return (
    <section id="courses" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary">My Courses</h2>
          <p className="text-lg text-muted-foreground mt-2">Invest in yourself and unlock your potential</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card key={index} className="flex flex-col overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
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
