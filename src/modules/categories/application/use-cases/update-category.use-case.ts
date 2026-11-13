import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { ICategoryRepository, CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository.interface';

export interface UpdateCategoryCommand {
  id: string;
  name?: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(command: UpdateCategoryCommand) {
    const category = await this.categoryRepo.findById(command.id);
    if (!category) {
      throw new NotFoundException(`Không tìm thấy danh mục với ID "${command.id}".`);
    }

    if (command.slug && command.slug !== category.slug) {
      const existing = await this.categoryRepo.findBySlug(command.slug);
      if (existing && existing.id !== category.id) {
        throw new ConflictException(`Đường dẫn slug "${command.slug}" đã tồn tại.`);
      }
    }

    category.updateDetails({
      name: command.name,
      slug: command.slug,
      description: command.description,
      imageUrl: command.imageUrl,
      displayOrder: command.displayOrder,
      isActive: command.isActive,
    });

    const updated = await this.categoryRepo.update(category);
    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      imageUrl: updated.imageUrl,
      displayOrder: updated.displayOrder,
      isActive: updated.isActive,
    };
  }
}

