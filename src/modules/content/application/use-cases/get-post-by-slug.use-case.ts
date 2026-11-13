import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IContentRepository, CONTENT_REPOSITORY } from '../../domain/repositories/content.repository.interface';
import { PostProps } from '../../domain/entities/content.types';

@Injectable()
export class GetPostBySlugUseCase {
  constructor(
    @Inject(CONTENT_REPOSITORY)
    private readonly contentRepo: IContentRepository,
  ) {}

  async execute(slug: string): Promise<PostProps> {
    const post = await this.contentRepo.findPostBySlug(slug);
    if (!post) {
      throw new NotFoundException(`Bài viết với đường dẫn "${slug}" không tồn tại.`);
    }
    return post;
  }
}

