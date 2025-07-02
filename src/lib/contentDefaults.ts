

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

export type Course = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  hint: string;
  price: string;
  category: string;
  link: string;
}

export type CoursesContent = {
  courses: Course[];
}

export const defaultCoursesContent: CoursesContent = {
  courses: [
    {
      id: "1",
      title: "Mastering Public Speaking",
      description: "Conquer your fear of public speaking and learn to deliver powerful, persuasive presentations.",
      thumbnail: "https://placehold.co/600x400.png",
      hint: "presentation stage",
      price: "$299",
      category: "Communication",
      link: "#",
    },
    {
      id: "2",
      title: "Personal Branding Blueprint",
      description: "Craft a compelling personal brand that opens doors to new opportunities and establishes you as a thought leader.",
      thumbnail: "https://placehold.co/600x400.png",
      hint: "personal branding",
      price: "$349",
      category: "Branding",
      link: "#",
    },
    {
      id: "3",
      title: "PR & Media Relations Mastery",
      description: "Learn how to effectively engage with the media, manage your public image, and secure positive press coverage.",
      thumbnail: "https://placehold.co/600x400.png",
      hint: "media interview",
      price: "$499",
      category: "PR",
      link: "#",
    },
  ]
};

export type ContactInfo = {
  email: string;
  phone: string;
  address: string;
  title: string;
  description: string;
};

export const defaultContactInfo: ContactInfo = {
  email: "contact@dheerendrasingh.com",
  phone: "+1 (234) 567-890",
  address: "New Delhi, India",
  title: "Contact Information",
  description: "For speaking engagements, media inquiries, or course information, please feel free to reach out.",
};

export type MediaItem = {
  id: string;
  type: 'article' | 'podcast' | 'video';
  title: string;
  quote: string;
  outletName: string;
  outletLogoUrl: string;
  link: string;
  coverImageUrl: string;
  coverImageHint: string;
  date: string;
};

export type MediaContent = {
  items: MediaItem[];
  filters: string[];
};

export const defaultMediaContent: MediaContent = {
  items: [
    {
      id: "1",
      type: "article",
      title: "The Future of Personal Branding",
      quote: "Dheerendra Singh offers a revolutionary take on how professionals can build an authentic and powerful personal brand in the digital age.",
      outletName: "Forbes",
      outletLogoUrl: "https://raw.githubusercontent.com/Dheerendra2000/hositng_data/main/forbes-logo-white.png",
      link: "#",
      coverImageUrl: "https://placehold.co/600x400.png",
      coverImageHint: "business magazine",
      date: "2023-10-15",
    },
    {
      id: "2",
      type: "podcast",
      title: "The Art of the Keynote",
      quote: "An in-depth conversation about what it takes to captivate an audience and deliver a message that resonates long after the event is over.",
      outletName: "The Speaker's Journey",
      outletLogoUrl: "https://raw.githubusercontent.com/Dheerendra2000/hositng_data/main/spotify-logo-white.png",
      link: "#",
      coverImageUrl: "https://placehold.co/600x400.png",
      coverImageHint: "podcast microphone",
      date: "2023-09-28",
    },
    {
      id: "3",
      type: "video",
      title: "Live on Startup Central",
      quote: "Discussing the critical role of public relations for early-stage startups and how to gain traction with a limited budget.",
      outletName: "Tech TV",
      outletLogoUrl: "https://raw.githubusercontent.com/Dheerendra2000/hositng_data/main/youtube-logo-white.png",
      link: "#",
      coverImageUrl: "https://placehold.co/600x400.png",
      coverImageHint: "tv studio",
      date: "2023-08-05",
    },
  ],
  filters: ["all", "article", "podcast", "video"],
};
