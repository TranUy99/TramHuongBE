import { Injectable, Inject } from '@nestjs/common';
import { IContentRepository, CONTENT_REPOSITORY } from '../../domain/repositories/content.repository.interface';

@Injectable()
export class GetStoreSettingsUseCase {
  constructor(
    @Inject(CONTENT_REPOSITORY)
    private readonly contentRepo: IContentRepository,
  ) {}

  async execute(): Promise<Record<string, any>> {
    return await this.contentRepo.getStoreSettings();
  }
}

