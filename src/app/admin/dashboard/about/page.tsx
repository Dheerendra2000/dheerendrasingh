import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import fs from 'fs/promises'
import path from 'path'
import AboutForm from './about-form'

type AboutContent = {
  imageUrl: string;
  imageHint: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  highlights: string[];
}

// This function must match the one in `src/components/sections/about.tsx`
// to ensure consistency.
async function getAboutContent(): Promise<AboutContent> {
  const contentFilePath = path.join(process.cwd(), 'src', 'lib', 'content', 'about.json');
  try {
    const data = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const defaultContent: AboutContent = {
        imageUrl: "https://placehold.co/600x800.png",
        imageHint: "professional portrait",
        heading: "A Passion for Communication and Branding",
        paragraph1: "Dheerendra Singh is a renowned public speaker and branding specialist with over a decade of experience in empowering individuals and organizations to communicate with impact and build unforgettable brands. His journey began with a passion for storytelling, which evolved into a mission to help others find their unique voice and leverage it for success.",
        paragraph2: "Through dynamic keynote speeches, interactive workshops, and personalized coaching, Dheerendra has transformed leaders, entrepreneurs, and professionals across various industries, enabling them to master the art of public relations and strategic branding.",
        highlights: [
          "15+ years of experience in public speaking",
          "Expert in personal and corporate branding",
          "Featured in major media outlets",
          "Helped 100+ clients build their brand presence",
        ]
      };
      await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
      await fs.writeFile(contentFilePath, JSON.stringify(defaultContent, null, 2));
      return defaultContent;
    }
    console.error("Failed to read about content, using default values:", error);
    throw new Error("Could not read about content file.");
  }
}

export default async function ManageAboutPage() {
  const content = await getAboutContent();

  return (
    <div className="flex min-h-screen flex-col bg-secondary">
       <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
            <Button asChild variant="ghost">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4"/>
                  <span>Back</span>
              </Link>
            </Button>
          <h1 className="text-xl md:text-2xl font-bold font-headline text-primary">
            Manage About Page
          </h1>
          <div className="w-16"></div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>Update the content of your 'About Me' section.</CardDescription>
            </CardHeader>
            <CardContent>
                <AboutForm content={content} />
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
