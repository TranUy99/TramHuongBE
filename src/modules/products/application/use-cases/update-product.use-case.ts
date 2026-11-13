import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { UpdateProductCommand, ProductResultDto } from '../dto/product.dto';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductResultDto> {
    const product = await this.productRepo.findById(command.id);
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID "${command.id}".`);
    }

    if (command.slug && command.slug !== product.slug) {
      const existingSlug = await this.productRepo.findBySlug(command.slug);
      if (existingSlug && existingSlug.id !== product.id) {
        throw new ConflictException(`Đường dẫn slug "${command.slug}" đã được sử dụng.`);
      }
    }

    product.updateDetails({
      categoryId: command.categoryId,
      name: command.name,
      slug: command.slug,
      shortDescription: command.shortDescription,
      description: command.description,
      specifications: command.specifications,
      basePrice: command.basePrice,
      salePrice: command.salePrice,
      stockQuantity: command.stockQuantity,
      isFeatured: command.isFeatured,
      isActive: command.isActive,
    });

    const updated = await this.productRepo.update(product);

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      sku: updated.sku,
      categoryId: updated.categoryId,
      shortDescription: updated.shortDescription,
      description: updated.description,
      specifications: updated.specifications,
      basePrice: updated.basePrice,
      salePrice: updated.salePrice,
      stockQuantity: updated.stockQuantity,
      isFeatured: updated.isFeatured,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
      variants: updated.variants,
      images: updated.images,
    };
  }
}

