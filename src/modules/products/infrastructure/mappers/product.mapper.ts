import { Product } from '../../domain/entities/product.entity';
import { Product as PrismaProduct, ProductVariant as PrismaVariant, ProductImage as PrismaImage } from '@prisma/client';

type PrismaProductWithRelations = PrismaProduct & {
  variants?: PrismaVariant[];
  images?: PrismaImage[];
};

export class ProductMapper {
  public static toDomain(raw: PrismaProductWithRelations): Product {
    const variants = raw.variants?.map((v) => ({
      id: v.id,
      sku: v.sku,
      name: v.name,
      price: Number(v.price),
      salePrice: v.salePrice ? Number(v.salePrice) : null,
      stockQuantity: v.stockQuantity,
      weightGrams: v.weightGrams ?? 0,
    })) || [];

    const images = raw.images?.map((img) => ({
      id: img.id,
      imageUrl: img.imageUrl,
      altText: img.altText ?? '',
      displayOrder: img.displayOrder,
      isPrimary: img.isPrimary,
    })) || [];

    return Product.create(
      {
        categoryId: raw.categoryId,
        name: raw.name,
        slug: raw.slug,
        sku: raw.sku,
        shortDescription: raw.shortDescription,
        description: raw.description,
        specifications: (raw.specifications as Record<string, any>) || {},
        basePrice: Number(raw.basePrice),
        salePrice: raw.salePrice ? Number(raw.salePrice) : null,
        stockQuantity: raw.stockQuantity,
        isFeatured: raw.isFeatured,
        isActive: raw.isActive,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        variants,
        images,
      },
      raw.id
    );
  }

  public static toPersistence(entity: Product): any {
    return {
      id: entity.id || undefined,
      categoryId: entity.categoryId || null,
      name: entity.name,
      slug: entity.slug,
      sku: entity.sku,
      shortDescription: entity.shortDescription || null,
      description: entity.description || null,
      specifications: entity.specifications,
      basePrice: entity.basePrice,
      salePrice: entity.salePrice || null,
      stockQuantity: entity.stockQuantity,
      isFeatured: entity.isFeatured,
      isActive: entity.isActive,
      variants: entity.variants?.length
        ? {
            create: entity.variants.map((v) => ({
              sku: v.sku,
              name: v.name,
              price: v.price,
              salePrice: v.salePrice || null,
              stockQuantity: v.stockQuantity,
              weightGrams: v.weightGrams || 0,
            })),
          }
        : undefined,
      images: entity.images?.length
        ? {
            create: entity.images.map((img) => ({
              imageUrl: img.imageUrl,
              altText: img.altText || null,
              displayOrder: img.displayOrder || 0,
              isPrimary: img.isPrimary || false,
            })),
          }
        : undefined,
    };
  }
}

