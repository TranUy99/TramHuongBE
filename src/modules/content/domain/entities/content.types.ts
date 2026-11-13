export interface BannerProps {
  id?: string;
  title: string;
  subtitle?: string | null;
  imageUrl: string;
  linkUrl: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
}

export interface FAQProps {
  id?: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isActive: boolean;
  createdAt?: Date;
}

export interface PostProps {
  id?: string;
  title: string;
  slug: string;
  summary?: string | null;
  content: string;
  thumbnailUrl?: string | null;
  authorName: string;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

