import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { IContentRepository } from '../../domain/repositories/content.repository.interface';
import { BannerProps, FAQProps, PostProps } from '../../domain/entities/content.types';

@Injectable()
export class PrismaContentRepository implements IContentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveBanners(): Promise<BannerProps[]> {
    return await this.prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findActiveFaqs(): Promise<FAQProps[]> {
    return await this.prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findPublishedPosts(): Promise<PostProps[]> {
    return await this.prisma.post.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findPostBySlug(slug: string): Promise<PostProps | null> {
    return await this.prisma.post.findUnique({
      where: { slug },
    });
  }

  async getStoreSettings(): Promise<Record<string, any>> {
    const settings = await this.prisma.storeSetting.findMany();
    const result: Record<string, any> = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });
    return result;
  }
}

