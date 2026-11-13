import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { ProductResultDto } from '../dto/product.dto';

@Injectable()
export class GetProductBySlugUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(slug: string): Promise<ProductResultDto> {
    const product = await this.productRepo.findBySlug(slug);
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với slug "${slug}"`);
    }

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      categoryId: product.categoryId,
      shortDescription: product.shortDescription,
      description: product.description,
      specifications: product.specifications,
      basePrice: product.basePrice,
      salePrice: product.salePrice,
      stockQuantity: product.stockQuantity,
      isFeatured: product.isFeatured,
      isActive: product.isActive,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      variants: product.variants,
      images: product.images,
    };
  }
}

