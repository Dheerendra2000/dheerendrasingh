export type HomeContent = {
  heroTitle: string;
  heroTagline: string;
  videoUrl: string;
}

export const defaultHomeContent: HomeContent = {
  heroTitle: "Dheerendra Singh",
  heroTagline: "Leading Public Speaker & Branding and PR Specialist",
  videoUrl: "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4",
};


export type AboutContent = {
  imageUrl: string;
  imageHint: string;
  heading: string;
  paragraph1: string;
  paragraph2: string;
  highlights: string[];
}

export const defaultAboutContent: AboutContent = {
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
