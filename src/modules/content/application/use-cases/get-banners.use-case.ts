import { Injectable, Inject } from '@nestjs/common';
import { IContentRepository, CONTENT_REPOSITORY } from '../../domain/repositories/content.repository.interface';
import { BannerProps } from '../../domain/entities/content.types';

@Injectable()
export class GetBannersUseCase {
  constructor(
    @Inject(CONTENT_REPOSITORY)
    private readonly contentRepo: IContentRepository,
  ) {}

  async execute(): Promise<BannerProps[]> {
    return await this.contentRepo.findActiveBanners();
  }
}

