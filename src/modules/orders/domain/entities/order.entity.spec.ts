import { Order, PaymentMethod, OrderStatus, PaymentStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { BusinessRuleViolationException } from '../../../../shared/domain/exceptions/domain.exception';

describe('Order Domain Aggregate', () => {
  const item1 = OrderItem.create({
    productId: 'p-1',
    productName: 'Trầm Nụ',
    sku: 'NU-01',
    unitPrice: 200000,
    quantity: 2,
    totalPrice: 400000,
  });

  it('phải tính toán tổng tiền và subtotal chính xác từ các OrderItems', () => {
    const order = Order.create({
      orderCode: 'MT-261105-001',
      customerName: 'Nguyễn Văn A',
      customerPhone: '0987654321',
      shippingAddress: '123 Đường Huế',
      shippingProvince: 'Thừa Thiên Huế',
      shippingFee: 30000,
      discountAmount: 0,
      subtotal: 0, // sẽ được tự động tính
      totalAmount: 0,
      paymentMethod: PaymentMethod.cod,
      paymentStatus: PaymentStatus.pending,
      orderStatus: OrderStatus.pending,
      items: [item1],
    });

    expect(order.subtotal).toBe(400000);
    expect(order.totalAmount).toBe(430000); // 400000 + 30000 ship
  });

  it('phải hủy đơn hàng thành công khi đơn ở trạng thái pending', () => {
    const order = Order.create({
      orderCode: 'MT-261105-002',
      customerName: 'Nguyễn Văn B',
      customerPhone: '0987654321',
      shippingAddress: '456 Đường Hương Trầm',
      shippingProvince: 'Huế',
      shippingFee: 0,
      discountAmount: 0,
      subtotal: 400000,
      totalAmount: 400000,
      paymentMethod: PaymentMethod.cod,
      paymentStatus: PaymentStatus.pending,
      orderStatus: OrderStatus.pending,
      items: [item1],
    });

    order.cancel('Khách đổi ý');
    expect(order.orderStatus).toBe(OrderStatus.cancelled);
  });

  it('phải ném BusinessRuleViolationException khi cố gắng hủy đơn đã hoàn thành', () => {
    const order = Order.create({
      orderCode: 'MT-261105-003',
      customerName: 'Nguyễn Văn C',
      customerPhone: '0987654321',
      shippingAddress: '789 Đường Hương',
      shippingProvince: 'Đà Nẵng',
      shippingFee: 0,
      discountAmount: 0,
      subtotal: 400000,
      totalAmount: 400000,
      paymentMethod: PaymentMethod.cod,
      paymentStatus: PaymentStatus.paid,
      orderStatus: OrderStatus.completed,
      items: [item1],
    });

    expect(() => {
      order.cancel('Hủy sau khi đã nhận hàng');
    }).toThrow(BusinessRuleViolationException);
  });
});

