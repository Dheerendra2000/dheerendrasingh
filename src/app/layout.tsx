
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import CustomCursor from '@/components/ui/custom-cursor';
import PageWrapper from '@/components/layout/page-wrapper';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dheerendrasingh.com'),
  title: 'Dheerendra Singh - Public Speaker & Branding Specialist',
  description: 'Official portfolio of Dheerendra Singh, a leading public speaker and branding & PR specialist. Explore his achievements, courses, and gallery.',
  keywords: ['Dheerendra Singh', 'public speaker', 'motivational speaker', 'branding specialist', 'PR specialist', 'keynote speaker', 'corporate trainer', 'leadership coach', 'Viksit Bharat', 'youth icon', 'personal branding', 'public relations', 'communication expert'],
  creator: 'Dheerendra Singh',
  authors: [{ name: 'Dheerendra Singh', url: 'https://www.dheerendrasingh.com' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Dheerendra Singh - Public Speaker & Branding Specialist',
    description: 'Official portfolio of Dheerendra Singh, a leading public speaker and branding & PR specialist.',
    url: 'https://www.dheerendrasingh.com',
    siteName: 'Dheerendra Singh Portfolio',
    images: [
      {
        url: 'https://raw.githubusercontent.com/Dheerendra2000/hositng_data/main/ico.png',
        width: 800,
        height: 600,
        alt: 'Dheerendra Singh promotional image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dheerendra Singh - Public Speaker & Branding Specialist',
    description: 'Official portfolio of Dheerendra Singh, a leading public speaker and branding & PR specialist.',
    images: ['https://raw.githubusercontent.com/Dheerendra2000/hositng_data/main/ico.png'],
    creator: '@Dheerendra',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
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
          <PageWrapper>
            {children}
          </PageWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
