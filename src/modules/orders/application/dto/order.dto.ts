import { PaymentMethod, OrderStatus, PaymentStatus } from '../../domain/entities/order.entity';

export interface CreateOrderItemInput {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export interface CreateOrderCommand {
  idempotencyKey?: string | null;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  shippingProvince: string;
  shippingDistrict?: string | null;
  orderNotes?: string | null;
  paymentMethod: PaymentMethod;
  items: CreateOrderItemInput[];
}

export interface OrderItemResultDto {
  id: string;
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  variantName?: string | null;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  specificationsSnapshot?: any;
}

export interface OrderResultDto {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  shippingAddress: string;
  shippingProvince: string;
  shippingDistrict?: string | null;
  orderNotes?: string | null;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItemResultDto[];
  createdAt: string;
  vietQrUrl?: string;
}

