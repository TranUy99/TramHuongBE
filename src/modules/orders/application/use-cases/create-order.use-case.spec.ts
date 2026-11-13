import { CreateOrderUseCase } from './create-order.use-case';
import { IOrderRepository } from '../../domain/repositories/order.repository.interface';
import { IProductRepository } from '../../../products/domain/repositories/product.repository.interface';
import { IUnitOfWork } from '../../../../shared/application/ports/unit-of-work.port';
import { Product } from '../../../products/domain/entities/product.entity';
import { Order, PaymentMethod } from '../../domain/entities/order.entity';

describe('CreateOrderUseCase', () => {
  let useCase: CreateOrderUseCase;
  let mockOrderRepo: Partial<IOrderRepository>;
  let mockProductRepo: Partial<IProductRepository>;
  let mockUow: IUnitOfWork;

  const testProduct = Product.create(
    {
      name: 'Trầm Nụ Thượng Hạng',
      slug: 'tram-nu-thuong-hang',
      sku: 'NU-01',
      basePrice: 280000,
      salePrice: 245000,
      stockQuantity: 50,
    },
    'prod-uuid-1',
  );

  beforeEach(() => {
    mockOrderRepo = {
      findByIdempotencyKey: jest.fn().mockResolvedValue(null),
      save: jest.fn(async (order: Order) => order),
    };

    mockProductRepo = {
      findById: jest.fn(async (id: string) => {
        if (id === 'prod-uuid-1') return testProduct;
        return null;
      }),
      deductStock: jest.fn().mockResolvedValue(undefined),
    };

    mockUow = {
      execute: jest.fn(async (work) => await work()),
    };

    useCase = new CreateOrderUseCase(
      mockOrderRepo as IOrderRepository,
      mockProductRepo as IProductRepository,
      mockUow,
    );
  });

  it('phải tạo đơn hàng thành công và lấy giá bán chính xác từ Database', async () => {
    const result = await useCase.execute({
      customerName: 'Trần Văn Mộc',
      customerPhone: '0987654321',
      shippingAddress: '100 Lê Lợi',
      shippingProvince: 'Huế',
      paymentMethod: PaymentMethod.cod,
      items: [
        {
          productId: 'prod-uuid-1',
          quantity: 2,
        },
      ],
    });

    expect(result.customerName).toBe('Trần Văn Mộc');
    expect(result.subtotal).toBe(245000 * 2); // 490.000đ (dưới 500k -> cộng 30k ship)
    expect(result.shippingFee).toBe(30000);
    expect(result.totalAmount).toBe(490000 + 30000);
    expect(mockProductRepo.deductStock).toHaveBeenCalledWith('prod-uuid-1', 2);
    expect(mockOrderRepo.save).toHaveBeenCalledTimes(1);
  });

  it('phải miễn phí vận chuyển khi đơn hàng từ 500.000đ trở lên', async () => {
    const result = await useCase.execute({
      customerName: 'Lê Thị An',
      customerPhone: '0987654321',
      shippingAddress: '200 Hùng Vương',
      shippingProvince: 'Huế',
      paymentMethod: PaymentMethod.bank_transfer,
      items: [
        {
          productId: 'prod-uuid-1',
          quantity: 3, // 245.000 * 3 = 735.000đ > 500k
        },
      ],
    });

    expect(result.subtotal).toBe(735000);
    expect(result.shippingFee).toBe(0); // Miễn phí ship
    expect(result.totalAmount).toBe(735000);
    expect(result.vietQrUrl).toBeDefined(); // Có VietQR do chọn bank_transfer
  });
});

