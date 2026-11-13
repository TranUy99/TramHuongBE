import { Injectable, Inject } from '@nestjs/common';
import { IContentRepository, CONTENT_REPOSITORY } from '../../domain/repositories/content.repository.interface';
import { FAQProps } from '../../domain/entities/content.types';

@Injectable()
export class GetFaqsUseCase {
  constructor(
    @Inject(CONTENT_REPOSITORY)
    private readonly contentRepo: IContentRepository,
  ) {}

  async execute(): Promise<FAQProps[]> {
    return await this.contentRepo.findActiveFaqs();
  }
}

