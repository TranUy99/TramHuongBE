import { Injectable, Inject } from '@nestjs/common';
import { IContentRepository, CONTENT_REPOSITORY } from '../../domain/repositories/content.repository.interface';
import { PostProps } from '../../domain/entities/content.types';

@Injectable()
export class GetPostsUseCase {
  constructor(
    @Inject(CONTENT_REPOSITORY)
    private readonly contentRepo: IContentRepository,
  ) {}

  async execute(): Promise<PostProps[]> {
    return await this.contentRepo.findPublishedPosts();
  }
}

