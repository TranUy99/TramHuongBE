import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository.interface';
import { IUnitOfWork, UNIT_OF_WORK } from '../../../../shared/application/ports/unit-of-work.port';
import { Order, PaymentMethod, PaymentStatus, OrderStatus } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { CreateOrderCommand, OrderResultDto } from '../dto/order.dto';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderResultDto> {
    // 1. Idempotency Check (Chống tạo đơn trùng khi click đúp)
    if (command.idempotencyKey) {
      const existing = await this.orderRepo.findByIdempotencyKey(command.idempotencyKey);
      if (existing) {
        return this.mapToResult(existing);
      }
    }

    if (!command.items || command.items.length === 0) {
      throw new BadRequestException('Đơn hàng phải có ít nhất 1 sản phẩm.');
    }

    // 2. Chạy toàn bộ quy trình kiểm tra, trừ kho và tạo đơn trong Transaction
    const savedOrder = await this.unitOfWork.execute(async () => {
      const orderItems: OrderItem[] = [];

      for (const itemInput of command.items) {
        if (itemInput.quantity <= 0) {
          throw new BadRequestException('Số lượng sản phẩm không hợp lệ.');
        }

        const product = await this.productRepo.findById(itemInput.productId);
        if (!product) {
          throw new NotFoundException(`Sản phẩm với ID "${itemInput.productId}" không tồn tại.`);
        }

        let variantName: string | null = null;
        let sku = product.sku;
        let unitPrice = product.salePrice ?? product.basePrice;

        if (itemInput.variantId) {
          const variant = product.variants.find((v) => v.id === itemInput.variantId);
          if (!variant) {
            throw new NotFoundException(`Quy cách sản phẩm không tồn tại.`);
          }
          if (variant.stockQuantity < itemInput.quantity) {
            throw new BadRequestException(`Quy cách "${variant.name}" không đủ tồn kho (còn ${variant.stockQuantity}).`);
          }
          variantName = variant.name;
          sku = variant.sku;
          unitPrice = variant.salePrice ?? variant.price;

          // Trừ kho biến thể & sản phẩm
          await this.productRepo.deductStock(product.id, itemInput.quantity, variant.id);
        } else {
          // Trừ kho sản phẩm thông thường
          product.deductStock(itemInput.quantity);
          await this.productRepo.deductStock(product.id, itemInput.quantity);
        }

        // Tạo OrderItem Snapshot bất biến
        const orderItem = OrderItem.create({
          productId: product.id,
          variantId: itemInput.variantId || null,
          productName: product.name,
          variantName,
          sku,
          unitPrice,
          quantity: itemInput.quantity,
          totalPrice: unitPrice * itemInput.quantity,
          specificationsSnapshot: product.specifications,
        });

        orderItems.push(orderItem);
      }

      // Tính toán phí ship (Đơn >= 500.000đ freeship, ngược lại 30.000đ)
      const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const shippingFee = subtotal >= 500000 ? 0 : 30000;
      const orderCode = this.generateOrderCode();

      const order = Order.create({
        orderCode,
        userId: command.userId || null,
        customerName: command.customerName,
        customerPhone: command.customerPhone,
        customerEmail: command.customerEmail || null,
        shippingAddress: command.shippingAddress,
        shippingProvince: command.shippingProvince,
        shippingDistrict: command.shippingDistrict || null,
        orderNotes: command.orderNotes || null,
        subtotal,
        shippingFee,
        discountAmount: 0,
        totalAmount: subtotal + shippingFee,
        paymentMethod: command.paymentMethod,
        paymentStatus: PaymentStatus.pending,
        orderStatus: OrderStatus.pending,
        idempotencyKey: command.idempotencyKey || null,
        items: orderItems,
      });

      return await this.orderRepo.save(order);
    });

    return this.mapToResult(savedOrder);
  }

  private generateOrderCode(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `MT-${year}${month}${day}-${randomChars}`;
  }

  private mapToResult(order: Order): OrderResultDto {
    const bankId = process.env.BANK_ID || 'MB';
    const accountNo = process.env.BANK_ACCOUNT_NO || '0987654321';
    const accountName = encodeURIComponent(process.env.BANK_ACCOUNT_NAME || 'TRAM HUONG MOC TRAM');
    const addInfo = encodeURIComponent(`Thanh toan don hang ${order.orderCode}`);

    const vietQrUrl =
      order.paymentMethod === PaymentMethod.bank_transfer
        ? `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${order.totalAmount}&addInfo=${addInfo}&accountName=${accountName}`
        : undefined;

    return {
      id: order.id,
      orderCode: order.orderCode,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddress,
      shippingProvince: order.shippingProvince,
      shippingDistrict: order.shippingDistrict,
      orderNotes: order.orderNotes,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt.toISOString(),
      vietQrUrl,
      items: order.items.map((i) => ({
        id: i.id,
        productId: i.productId,
        variantId: i.variantId,
        productName: i.productName,
        variantName: i.variantName,
        sku: i.sku,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        totalPrice: i.totalPrice,
        specificationsSnapshot: i.specificationsSnapshot,
      })),
    };
  }
}

