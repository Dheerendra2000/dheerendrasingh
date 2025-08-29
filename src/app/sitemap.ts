import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.dheerendrasingh.com';

  // These are the static pages of the site
  const staticRoutes = [
    '/',
    '/media',
  ];
  
  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));

  // You can later add dynamic routes here (e.g., from a CMS or database)
  // const dynamicUrls = ...

  return [
    ...staticUrls,
    // ...dynamicUrls,
  ]
}
