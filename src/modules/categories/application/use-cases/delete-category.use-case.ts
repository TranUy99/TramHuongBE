import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ICategoryRepository, CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository.interface';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(id: string): Promise<{ deleted: boolean; id: string }> {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID "${id}".`);
    }

    await this.categoryRepo.delete(id);
    return { deleted: true, id };
  }
}

