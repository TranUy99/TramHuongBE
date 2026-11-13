import { Module } from '@nestjs/common';
import { ContentController } from './presentation/content.controller';
import { GetBannersUseCase } from './application/use-cases/get-banners.use-case';
import { GetFaqsUseCase } from './application/use-cases/get-faqs.use-case';
import { GetPostsUseCase } from './application/use-cases/get-posts.use-case';
import { GetPostBySlugUseCase } from './application/use-cases/get-post-by-slug.use-case';
import { GetStoreSettingsUseCase } from './application/use-cases/get-store-settings.use-case';
import { CONTENT_REPOSITORY } from './domain/repositories/content.repository.interface';
import { PrismaContentRepository } from './infrastructure/repositories/prisma-content.repository';

@Module({
  controllers: [ContentController],
  providers: [
    GetBannersUseCase,
    GetFaqsUseCase,
    GetPostsUseCase,
    GetPostBySlugUseCase,
    GetStoreSettingsUseCase,
    {
      provide: CONTENT_REPOSITORY,
      useClass: PrismaContentRepository,
    },
  ],
  exports: [
    CONTENT_REPOSITORY,
    GetBannersUseCase,
    GetFaqsUseCase,
    GetPostsUseCase,
    GetPostBySlugUseCase,
    GetStoreSettingsUseCase,
  ],
})
export class ContentModule {}
