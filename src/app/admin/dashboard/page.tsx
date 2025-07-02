
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, MessageSquare, Images, Home, User, Award, Phone, Newspaper } from 'lucide-react'
import LogoutButton from './logout-button'

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-secondary">
      <header className="bg-background border-b shadow-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <h1 className="text-2xl font-bold font-headline text-primary">
            Admin Dashboard
          </h1>
          <LogoutButton />
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Welcome, Admin!</CardTitle>
            <CardDescription>This is your control center. Manage your website's content from here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>You can now start building out management features for your portfolio.</p>
            <div className="mt-6">
                <Button asChild>
                    <a href="/">View Live Site</a>
                </Button>
            </div>
          </CardContent>
        </Card>

        <h3 className="text-2xl font-bold font-headline mb-4 text-primary">Manage Content</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Home</CardTitle>
                    <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Manage your home page content.</p>
                     <Button asChild variant="link" className="p-0 h-auto mt-4 text-primary">
                        <a href="/admin/dashboard/home">Manage Home</a>
                     </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">About Me</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Update your 'About Me' section.</p>
                     <Button asChild variant="link" className="p-0 h-auto mt-4 text-primary">
                       <a href="/admin/dashboard/about">Manage About</a>
                     </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gallery</CardTitle>
                    <Images className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Update your image gallery.</p>
                    <Button asChild variant="link" className="p-0 h-auto mt-4 text-primary">
                       <a href="/admin/dashboard/gallery">Manage Gallery</a>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Media Coverage</CardTitle>
                    <Newspaper className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Manage your press and media features.</p>
                    <Button asChild variant="link" className="p-0 h-auto mt-4 text-primary">
                       <a href="/admin/dashboard/media">Manage Media</a>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Manage your achievements timeline.</p>
                    <Button asChild variant="link" className="p-0 h-auto mt-4 text-primary">
                      <a href="/admin/dashboard/achievements">Manage Achievements</a>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Courses</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Manage your course listings.</p>
                     <Button asChild variant="link" className="p-0 h-auto mt-4 text-primary">
                       <a href="/admin/dashboard/courses">Manage Courses</a>
                     </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Add and edit client testimonials.</p>
                    <Button asChild variant="link" className="p-0 h-auto mt-4 text-primary">
                       <a href="/admin/dashboard/testimonials">Manage Testimonials</a>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Contact Info</CardTitle>
                    <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground">Update public contact details.</p>
                    <Button asChild variant="link" className="p-0 h-auto mt-4 text-primary">
                       <a href="/admin/dashboard/contact">Manage Contact</a>
                    </Button>
                </CardContent>
            </Card>
        </div>

      </main>
    </div>
  )
}
