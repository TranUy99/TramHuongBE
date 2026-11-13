import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import { OrderResultDto } from '../dto/order.dto';
import { PaymentMethod } from '../../domain/entities/order.entity';

@Injectable()
export class TrackOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(orderCode: string, phone: string): Promise<OrderResultDto> {
    const cleanCode = orderCode.trim().toUpperCase();
    const cleanPhone = phone.trim();

    const order = await this.orderRepo.findByCodeAndPhone(cleanCode, cleanPhone);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng phù hợp với mã đơn và số điện thoại đã cung cấp.');
    }

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
      })),
    };
  }
}

