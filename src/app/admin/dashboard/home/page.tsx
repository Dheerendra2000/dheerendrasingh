import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import fs from 'fs/promises'
import path from 'path'
import HomeForm from './home-form'

type HomeContent = {
  heroTitle: string;
  heroTagline: string;
  videoUrl: string;
}

async function getHomeContent(): Promise<HomeContent> {
  const contentFilePath = path.join(process.cwd(), 'src', 'lib', 'content', 'home.json');
  try {
    const data = await fs.readFile(contentFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with default content
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      const defaultContent: HomeContent = {
        heroTitle: "Dheerendra Singh",
        heroTagline: "Leading Public Speaker & Branding and PR Specialist",
        videoUrl: "https://dummy-media.torchbox.com/media/hero-1920x1080.mp4",
      };
      await fs.mkdir(path.dirname(contentFilePath), { recursive: true });
      await fs.writeFile(contentFilePath, JSON.stringify(defaultContent, null, 2));
      return defaultContent;
    }
    console.error("Failed to read home content, using default values:", error);
    // Fallback for other errors
    return {
      heroTitle: "Dheerendra Singh",
      heroTagline: "Leading Public Speaker & Branding and PR Specialist",
      videoUrl: "https://dummy-media.torchbox.com/media/hero-1920x1080.mp4",
    };
  }
}


export default async function ManageHomePage() {
  const content = await getHomeContent();

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
            Manage Home Page
          </h1>
          <div className="w-16"></div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Update the title, tagline, and background video of your hero section.</CardDescription>
            </CardHeader>
            <CardContent>
                <HomeForm content={content} />
            </CardContent>
        </Card>
      </main>
    </div>
  )
}
