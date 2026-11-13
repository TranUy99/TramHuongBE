import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductCommand, ProductResultDto } from '../dto/product.dto';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductResultDto> {
    // 1. Kiểm tra SKU duy nhất
    const existingSku = await this.productRepo.findBySku(command.sku);
    if (existingSku) {
      throw new ConflictException(`Mã SKU "${command.sku}" đã tồn tại trên hệ thống.`);
    }

    // 2. Kiểm tra Slug duy nhất
    const existingSlug = await this.productRepo.findBySlug(command.slug);
    if (existingSlug) {
      throw new ConflictException(`Đường dẫn slug "${command.slug}" đã được sử dụng.`);
    }

    // 3. Khởi tạo Domain Entity (Business Rules kiểm tra tự động)
    const images = command.imageUrls?.map((url, index) => ({
      imageUrl: url,
      altText: command.name,
      displayOrder: index + 1,
      isPrimary: index === 0,
    })) || [];

    const product = Product.create({
      categoryId: command.categoryId,
      name: command.name,
      slug: command.slug,
      sku: command.sku,
      shortDescription: command.shortDescription,
      description: command.description,
      specifications: command.specifications,
      basePrice: command.basePrice,
      salePrice: command.salePrice,
      stockQuantity: command.stockQuantity,
      isFeatured: command.isFeatured,
      isActive: command.isActive,
      variants: command.variants,
      images,
    });

    // 4. Lưu Entity qua Repository Interface
    const saved = await this.productRepo.save(product);

    return {
      id: saved.id,
      name: saved.name,
      slug: saved.slug,
      sku: saved.sku,
      categoryId: saved.categoryId,
      shortDescription: saved.shortDescription,
      description: saved.description,
      specifications: saved.specifications,
      basePrice: saved.basePrice,
      salePrice: saved.salePrice,
      stockQuantity: saved.stockQuantity,
      isFeatured: saved.isFeatured,
      isActive: saved.isActive,
      createdAt: saved.createdAt.toISOString(),
      updatedAt: saved.updatedAt.toISOString(),
      variants: saved.variants,
      images: saved.images,
    };
  }
}

