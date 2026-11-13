import { Product } from './product.entity';
import { BusinessRuleViolationException, InsufficientStockException } from '../../../../shared/domain/exceptions/domain.exception';

describe('Product Domain Entity', () => {
  it('phải tạo được Product Entity hợp lệ khi các tham số đúng', () => {
    const product = Product.create({
      name: 'Trầm Nụ Thượng Hạng',
      slug: 'tram-nu-thuong-hang',
      sku: 'NU-01',
      basePrice: 280000,
      salePrice: 245000,
      stockQuantity: 100,
    });

    expect(product.name).toBe('Trầm Nụ Thượng Hạng');
    expect(product.basePrice).toBe(280000);
    expect(product.salePrice).toBe(245000);
    expect(product.stockQuantity).toBe(100);
    expect(product.isActive).toBe(true);
  });

  it('phải ném BusinessRuleViolationException khi giá gốc là số âm', () => {
    expect(() => {
      Product.create({
        name: 'Trầm Nụ Lỗi',
        slug: 'tram-nu-loi',
        sku: 'NU-ERR-1',
        basePrice: -50000,
        stockQuantity: 10,
      });
    }).toThrow(BusinessRuleViolationException);
  });

  it('phải ném BusinessRuleViolationException khi giá khuyến mãi lớn hơn giá gốc', () => {
    expect(() => {
      Product.create({
        name: 'Trầm Nụ Lỗi',
        slug: 'tram-nu-loi',
        sku: 'NU-ERR-2',
        basePrice: 200000,
        salePrice: 250000, // Sai quy tắc
        stockQuantity: 10,
      });
    }).toThrow(BusinessRuleViolationException);
  });

  it('phải trừ được tồn kho thành công khi số lượng hợp lệ', () => {
    const product = Product.create({
      name: 'Trầm Nụ Thượng Hạng',
      slug: 'tram-nu',
      sku: 'NU-01',
      basePrice: 280000,
      stockQuantity: 50,
    });

    product.deductStock(10);
    expect(product.stockQuantity).toBe(40);
  });

  it('phải ném InsufficientStockException khi trừ vượt quá số lượng tồn kho', () => {
    const product = Product.create({
      name: 'Trầm Nụ Thượng Hạng',
      slug: 'tram-nu',
      sku: 'NU-01',
      basePrice: 280000,
      stockQuantity: 5,
    });

    expect(() => {
      product.deductStock(10); // Vượt tồn kho
    }).toThrow(InsufficientStockException);
  });
});

