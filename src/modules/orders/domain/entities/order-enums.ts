export enum OrderStatus {
  pending = 'pending',
  confirmed = 'confirmed',
  processing = 'processing',
  shipping = 'shipping',
  completed = 'completed',
  cancelled = 'cancelled',
}

export enum PaymentMethod {
  cod = 'cod',
  bank_transfer = 'bank_transfer',
}

export enum PaymentStatus {
  pending = 'pending',
  paid = 'paid',
  failed = 'failed',
  refunded = 'refunded',
}

