import { Controller, Get, Param } from '@nestjs/common';
import { GetBannersUseCase } from '../application/use-cases/get-banners.use-case';
import { GetFaqsUseCase } from '../application/use-cases/get-faqs.use-case';
import { GetPostsUseCase } from '../application/use-cases/get-posts.use-case';
import { GetPostBySlugUseCase } from '../application/use-cases/get-post-by-slug.use-case';
import { GetStoreSettingsUseCase } from '../application/use-cases/get-store-settings.use-case';

@Controller('api/v1/content')
export class ContentController {
  constructor(
    private readonly getBannersUseCase: GetBannersUseCase,
    private readonly getFaqsUseCase: GetFaqsUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostBySlugUseCase: GetPostBySlugUseCase,
    private readonly getStoreSettingsUseCase: GetStoreSettingsUseCase,
  ) {}

  @Get('banners')
  async getBanners() {
    return await this.getBannersUseCase.execute();
  }

  @Get('faqs')
  async getFaqs() {
    return await this.getFaqsUseCase.execute();
  }

  @Get('posts')
  async getPosts() {
    return await this.getPostsUseCase.execute();
  }

  @Get('posts/:slug')
  async getPostBySlug(@Param('slug') slug: string) {
    return await this.getPostBySlugUseCase.execute(slug);
  }

  @Get('settings')
  async getSettings() {
    return await this.getStoreSettingsUseCase.execute();
  }
}
