

export type HomeContent = {
  heroTitle: string;
  heroTagline: string;
  videoUrl: string;
  heroTitleColor: string;
  heroTaglineColor: string;
}

export const defaultHomeContent: HomeContent = {
  heroTitle: "Dheerendra Singh",
  heroTagline: "Leading Public Speaker & Branding and PR Specialist",
  videoUrl: "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4",
  heroTitleColor: "#FFD700",
  heroTaglineColor: "#F8FAFC",
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

export type Achievement = {
  id: string;
  icon: string;
  year: string;
  title: string;
  description: string;
}

export type AchievementsContent = {
  achievements: Achievement[];
}

export const defaultAchievementsContent: AchievementsContent = {
  achievements: [
     {
      id: "1",
      icon: "Award",
      year: "2023",
      title: "Speaker of the Year Award",
      description: "Recognized for outstanding and impactful keynote speeches at the National Speakers Conference.",
    },
    {
      id: "2",
      icon: "Megaphone",
      year: "2022",
      title: "Lead 'BrandU' Campaign",
      description: "Led a successful nationwide PR campaign that increased client visibility by 300%.",
    },
    {
      id: "3",
      icon: "Newspaper",
      year: "2021",
      title: "Forbes Magazine Feature",
      description: "Featured in an article on 'Top 10 Branding Gurus to Watch'.",
    },
    {
      id: "4",
      icon: "Award",
      year: "2020",
      title: "Excellence in Communication Award",
      description: "Awarded by the Public Relations Society for innovative communication strategies.",
    },
  ]
};

export type GalleryItem = {
  id: string;
  type: 'image' | 'video';
  category: string;
  src: string; // Image URL or Video Poster URL
  alt: string;
  hint: string;
  videoSrc?: string; // URL for the video file
  size?: 'regular' | 'large';
};

export type GalleryContent = {
  items: GalleryItem[];
  filters: string[];
};

export const defaultGalleryContent: GalleryContent = {
  filters: ["all", "events", "media", "behind-the-scenes", "workshops"],
  items: [
    { id: "1", type: "image", category: "events", src: "https://placehold.co/600x400.png", alt: "Speaking at a major tech conference", hint: "conference stage", size: "large" },
    { id: "2", type: "video", category: "workshops", src: "https://placehold.co/600x400.png", videoSrc: "https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4", alt: "A sample workshop video", hint: "workshop video", size: "regular" },
    { id: "3", type: "image", category: "media", src: "https://placehold.co/600x400.png", alt: "Interview on a TV show", hint: "tv interview", size: "regular" },
    { id: "4", type: "image", category: "behind-the-scenes", src: "https://placehold.co/600x400.png", alt: "Preparing backstage for a keynote", hint: "backstage preparation", size: "regular" },
    { id: "5", type: "image", category: "events", src: "https://placehold.co/600x400.png", alt: "Workshop with a corporate team", hint: "corporate workshop", size: "regular" },
    { id: "6", type: "image", category: "media", src: "https://placehold.co/600x400.png", alt: "Podcast recording session", hint: "podcast recording", size: "large" },
    { id: "7", type: "image", category: "events", src: "https://placehold.co/600x400.png", alt: "Panel discussion on branding", hint: "panel discussion", size: "regular" },
    { id: "8", type: "image", category: "behind-the-scenes", src: "https://placehold.co/600x400.png", alt: "Meeting with a client", hint: "client meeting", size: "regular" },
  ]
};

export type Testimonial = {
  id: string;
  name: string;
  title: string;
  image: string;
  hint: string;
  quote: string;
};

export type TestimonialsContent = {
  testimonials: Testimonial[];
};

export const defaultTestimonialsContent: TestimonialsContent = {
  testimonials: [
    {
      id: "1",
      name: "John Doe",
      title: "CEO, TechCorp",
      image: "https://placehold.co/100x100.png",
      hint: "man portrait",
      quote: "Dheerendra's branding strategies revolutionized our market approach. His insights are invaluable, and his delivery is captivating.",
    },
    {
      id: "2",
      name: "Jane Smith",
      title: "Marketing Director, Innovate Ltd.",
      image: "https://placehold.co/100x100.png",
      hint: "woman portrait",
      quote: "Working with Dheerendra was a game-changer. His public speaking course gave our team the confidence to shine.",
    },
    {
      id: "3",
      name: "Samuel Green",
      title: "Startup Founder",
      image: "https://placehold.co/100x100.png",
      hint: "person portrait",
      quote: "As a founder, getting the brand story right is crucial. Dheerendra helped me craft a narrative that resonates with investors and customers.",
    },
  ]
};
