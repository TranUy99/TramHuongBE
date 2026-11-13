import { Injectable, Inject } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY, ProductQueryFilters } from '../../domain/repositories/product.repository.interface';
import { ProductResultDto } from '../dto/product.dto';

@Injectable()
export class GetProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(filters: ProductQueryFilters): Promise<{ products: ProductResultDto[]; total: number }> {
    const { products, total } = await this.productRepo.findAll(filters);

    const mapped = products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      categoryId: p.categoryId,
      shortDescription: p.shortDescription,
      description: p.description,
      specifications: p.specifications,
      basePrice: p.basePrice,
      salePrice: p.salePrice,
      stockQuantity: p.stockQuantity,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      variants: p.variants,
      images: p.images,
    }));

    return { products: mapped, total };
  }
}

