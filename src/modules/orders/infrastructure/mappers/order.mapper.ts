import { Order, PaymentMethod, PaymentStatus, OrderStatus } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { Order as PrismaOrder, OrderItem as PrismaOrderItem } from '@prisma/client';

type PrismaOrderWithItems = PrismaOrder & {
  items?: PrismaOrderItem[];
};

export class OrderMapper {
  public static toDomain(raw: PrismaOrderWithItems): Order {
    const items = (raw.items || []).map((i) =>
      OrderItem.create(
        {
          productId: i.productId,
          variantId: i.variantId,
          productName: i.productName,
          variantName: i.variantName,
          sku: i.sku,
          unitPrice: Number(i.unitPrice),
          quantity: i.quantity,
          totalPrice: Number(i.totalPrice),
          specificationsSnapshot: (i.specificationsSnapshot as Record<string, any>) || null,
        },
        i.id
      )
    );

    return Order.create(
      {
        orderCode: raw.orderCode,
        userId: raw.userId,
        customerName: raw.customerName,
        customerPhone: raw.customerPhone,
        customerEmail: raw.customerEmail,
        shippingAddress: raw.shippingAddress,
        shippingProvince: raw.shippingProvince,
        shippingDistrict: raw.shippingDistrict,
        orderNotes: raw.orderNotes,
        subtotal: Number(raw.subtotal),
        shippingFee: Number(raw.shippingFee),
        discountAmount: Number(raw.discountAmount),
        totalAmount: Number(raw.totalAmount),
        paymentMethod: raw.paymentMethod as unknown as PaymentMethod,
        paymentStatus: raw.paymentStatus as unknown as PaymentStatus,
        orderStatus: raw.orderStatus as unknown as OrderStatus,
        internalNotes: raw.internalNotes,
        idempotencyKey: raw.idempotencyKey,
        items,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id
    );
  }

  public static toPersistence(entity: Order): any {
    return {
      id: entity.id || undefined,
      orderCode: entity.orderCode,
      userId: entity.userId || null,
      customerName: entity.customerName,
      customerPhone: entity.customerPhone,
      customerEmail: entity.customerEmail || null,
      shippingAddress: entity.shippingAddress,
      shippingProvince: entity.shippingProvince,
      shippingDistrict: entity.shippingDistrict || null,
      orderNotes: entity.orderNotes || null,
      subtotal: entity.subtotal,
      shippingFee: entity.shippingFee,
      discountAmount: entity.discountAmount,
      totalAmount: entity.totalAmount,
      paymentMethod: entity.paymentMethod,
      paymentStatus: entity.paymentStatus,
      orderStatus: entity.orderStatus,
      internalNotes: entity.internalNotes || null,
      idempotencyKey: entity.idempotencyKey || null,
      items: {
        create: entity.items.map((i) => ({
          productId: i.productId || null,
          variantId: i.variantId || null,
          productName: i.productName,
          variantName: i.variantName || null,
          sku: i.sku,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          totalPrice: i.totalPrice,
          specificationsSnapshot: i.specificationsSnapshot || undefined,
        })),
      },
    };
  }
}

