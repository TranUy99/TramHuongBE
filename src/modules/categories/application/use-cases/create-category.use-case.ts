import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ICategoryRepository, CATEGORY_REPOSITORY } from '../../domain/repositories/category.repository.interface';
import { Category } from '../../domain/entities/category.entity';

export interface CreateCategoryCommand {
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async execute(command: CreateCategoryCommand) {
    const existing = await this.categoryRepo.findBySlug(command.slug);
    if (existing) {
      throw new ConflictException(`Đường dẫn slug "${command.slug}" đã tồn tại.`);
    }

    const category = Category.create({
      name: command.name,
      slug: command.slug,
      description: command.description,
      imageUrl: command.imageUrl,
      displayOrder: command.displayOrder,
      isActive: command.isActive,
    });

    const saved = await this.categoryRepo.save(category);
    return {
      id: saved.id,
      name: saved.name,
      slug: saved.slug,
      description: saved.description,
      imageUrl: saved.imageUrl,
      displayOrder: saved.displayOrder,
      isActive: saved.isActive,
    };
  }
}

