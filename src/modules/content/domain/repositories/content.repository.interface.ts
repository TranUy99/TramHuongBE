import { BannerProps, FAQProps, PostProps } from '../entities/content.types';

export const CONTENT_REPOSITORY = Symbol('CONTENT_REPOSITORY');

export interface IContentRepository {
  findActiveBanners(): Promise<BannerProps[]>;
  findActiveFaqs(): Promise<FAQProps[]>;
  findPublishedPosts(): Promise<PostProps[]>;
  findPostBySlug(slug: string): Promise<PostProps | null>;
  getStoreSettings(): Promise<Record<string, any>>;
}

