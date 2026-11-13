import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { ICategoryRepository } from '../../domain/repositories/category.repository.interface';
import { Category } from '../../domain/entities/category.entity';

@Injectable()
export class PrismaCategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(raw: any): Category {
    return Category.create(
      {
        name: raw.name,
        slug: raw.slug,
        description: raw.description,
        imageUrl: raw.imageUrl,
        displayOrder: raw.displayOrder,
        isActive: raw.isActive,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id
    );
  }

  async findById(id: string): Promise<Category | null> {
    const raw = await this.prisma.category.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const raw = await this.prisma.category.findUnique({ where: { slug } });
    return raw ? this.toDomain(raw) : null;
  }

  async findAll(activeOnly = true): Promise<Category[]> {
    const where = activeOnly ? { isActive: true } : {};
    const raw = await this.prisma.category.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });
    return raw.map((item) => this.toDomain(item));
  }

  async save(category: Category): Promise<Category> {
    const created = await this.prisma.category.create({
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description || null,
        imageUrl: category.imageUrl || null,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
      },
    });
    return this.toDomain(created);
  }

  async update(category: Category): Promise<Category> {
    const updated = await this.prisma.category.update({
      where: { id: category.id },
      data: {
        name: category.name,
        slug: category.slug,
        description: category.description || null,
        imageUrl: category.imageUrl || null,
        displayOrder: category.displayOrder,
        isActive: category.isActive,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.category.delete({ where: { id } });
  }
}

