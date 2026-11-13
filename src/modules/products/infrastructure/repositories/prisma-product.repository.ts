import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { IProductRepository, ProductQueryFilters } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true, category: true },
    });
    return raw ? ProductMapper.toDomain(raw) : null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({
      where: { sku },
      include: { variants: true, images: true },
    });
    return raw ? ProductMapper.toDomain(raw) : null;
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({
      where: { slug },
      include: { variants: true, images: true, category: true },
    });
    return raw ? ProductMapper.toDomain(raw) : null;
  }

  async findAll(filters: ProductQueryFilters = {}): Promise<{ products: Product[]; total: number }> {
    const where: any = {};

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters.categorySlug) {
      where.category = { slug: filters.categorySlug };
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.minPrice !== undefined) {
      where.basePrice = { ...where.basePrice, gte: filters.minPrice };
    }
    if (filters.maxPrice !== undefined) {
      where.basePrice = { ...where.basePrice, lte: filters.maxPrice };
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters.sort === 'price_asc') {
      orderBy = { basePrice: 'asc' };
    } else if (filters.sort === 'price_desc') {
      orderBy = { basePrice: 'desc' };
    }

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: filters.skip,
        take: filters.take,
        include: { variants: true, images: true, category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: items.map(ProductMapper.toDomain),
      total,
    };
  }

  async save(product: Product): Promise<Product> {
    const data = ProductMapper.toPersistence(product);
    const created = await this.prisma.product.create({
      data,
      include: { variants: true, images: true },
    });
    return ProductMapper.toDomain(created);
  }

  async update(product: Product): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id: product.id },
      data: {
        categoryId: product.categoryId ?? null,
        name: product.name,
        slug: product.slug,
        basePrice: product.basePrice,
        salePrice: product.salePrice,
        stockQuantity: product.stockQuantity,
        shortDescription: product.shortDescription,
        description: product.description,
        specifications: product.specifications,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      },
      include: { variants: true, images: true },
    });
    return ProductMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  async deductStock(productId: string, quantity: number, variantId?: string): Promise<void> {
    if (variantId) {
      await this.prisma.productVariant.update({
        where: { id: variantId },
        data: { stockQuantity: { decrement: quantity } },
      });
    }
    await this.prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: { decrement: quantity } },
    });
  }

  async restoreStock(productId: string, quantity: number, variantId?: string): Promise<void> {
    if (variantId) {
      await this.prisma.productVariant.update({
        where: { id: variantId },
        data: { stockQuantity: { increment: quantity } },
      });
    }
    await this.prisma.product.update({
      where: { id: productId },
      data: { stockQuantity: { increment: quantity } },
    });
  }
}

