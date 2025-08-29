import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import CustomCursor from '@/components/ui/custom-cursor';

export const metadata: Metadata = {
  title: 'Dheerendra Singh - Public Speaker & Branding Specialist',
  description: 'Official portfolio of Dheerendra Singh, a leading public speaker and branding & PR specialist. Explore his achievements, courses, and gallery.',
  keywords: ['Dheerendra Singh', 'public speaker', 'branding', 'PR specialist', 'keynote speaker', 'courses'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <CustomCursor />
          <div className="aurora-bg" />
          <div className="relative z-10">
            {children}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
