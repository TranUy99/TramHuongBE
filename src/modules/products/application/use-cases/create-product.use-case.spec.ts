import { CreateProductUseCase } from './create-product.use-case';
import { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { ConflictException } from '@nestjs/common';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockProductRepo: Partial<IProductRepository>;

  beforeEach(() => {
    const productsDb: Product[] = [];

    mockProductRepo = {
      findBySku: jest.fn(async (sku: string) => {
        return productsDb.find((p) => p.sku === sku) || null;
      }),
      findBySlug: jest.fn(async (slug: string) => {
        return productsDb.find((p) => p.slug === slug) || null;
      }),
      save: jest.fn(async (product: Product) => {
        productsDb.push(product);
        return product;
      }),
    };

    useCase = new CreateProductUseCase(mockProductRepo as IProductRepository);
  });

  it('phải tạo sản phẩm thành công khi SKU và Slug chưa tồn tại', async () => {
    const result = await useCase.execute({
      name: 'Nhang Trầm Tăm Mộc',
      slug: 'nhang-tram-tam-moc',
      sku: 'NH-TM-01',
      basePrice: 195000,
      stockQuantity: 100,
    });

    expect(result.name).toBe('Nhang Trầm Tăm Mộc');
    expect(result.sku).toBe('NH-TM-01');
    expect(mockProductRepo.save).toHaveBeenCalledTimes(1);
  });

  it('phải ném ConflictException khi SKU đã tồn tại', async () => {
    // Lưu trước 1 sản phẩm với SKU 'DUPLICATE'
    await useCase.execute({
      name: 'Sản phẩm 1',
      slug: 'sp-1',
      sku: 'DUPLICATE',
      basePrice: 100000,
      stockQuantity: 10,
    });

    // Thử tạo sản phẩm thứ 2 có cùng SKU
    await expect(
      useCase.execute({
        name: 'Sản phẩm 2',
        slug: 'sp-2',
        sku: 'DUPLICATE',
        basePrice: 150000,
        stockQuantity: 20,
      }),
    ).rejects.toThrow(ConflictException);
  });
});

