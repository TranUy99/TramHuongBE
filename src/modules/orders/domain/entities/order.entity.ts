import { BaseEntity } from '../../../../shared/domain/entity.base';
import { BusinessRuleViolationException } from '../../../../shared/domain/exceptions/domain.exception';
import { OrderItem } from './order-item.entity';
import { OrderStatus, PaymentMethod, PaymentStatus } from './order-enums';

export { OrderStatus, PaymentMethod, PaymentStatus };

export interface OrderProps {
  orderCode: string;
  userId?: string | null;
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
  internalNotes?: string | null;
  idempotencyKey?: string | null;
  items: OrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export class Order extends BaseEntity<OrderProps> {
  private constructor(props: OrderProps, id?: string) {
    super(props, id);
  }

  public static create(props: OrderProps, id?: string): Order {
    if (!props.customerName || !props.customerName.trim()) {
      throw new BusinessRuleViolationException('Họ tên khách hàng không được để trống.');
    }
    if (!props.customerPhone || !props.customerPhone.trim()) {
      throw new BusinessRuleViolationException('Số điện thoại không được để trống.');
    }
    if (!props.shippingAddress || !props.shippingAddress.trim()) {
      throw new BusinessRuleViolationException('Địa chỉ giao hàng không được để trống.');
    }
    if (!props.items || props.items.length === 0) {
      throw new BusinessRuleViolationException('Đơn hàng phải có ít nhất 1 sản phẩm.');
    }

    const calculatedSubtotal = props.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const calculatedTotal = calculatedSubtotal + (props.shippingFee || 0) - (props.discountAmount || 0);

    return new Order(
      {
        ...props,
        subtotal: calculatedSubtotal,
        totalAmount: Math.max(0, calculatedTotal),
        paymentStatus: props.paymentStatus || PaymentStatus.pending,
        orderStatus: props.orderStatus || OrderStatus.pending,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id
    );
  }

  // Getters
  get orderCode(): string { return this.props.orderCode; }
  get userId(): string | null | undefined { return this.props.userId; }
  get customerName(): string { return this.props.customerName; }
  get customerPhone(): string { return this.props.customerPhone; }
  get customerEmail(): string | null | undefined { return this.props.customerEmail; }
  get shippingAddress(): string { return this.props.shippingAddress; }
  get shippingProvince(): string { return this.props.shippingProvince; }
  get shippingDistrict(): string | null | undefined { return this.props.shippingDistrict; }
  get orderNotes(): string | null | undefined { return this.props.orderNotes; }
  get subtotal(): number { return this.props.subtotal; }
  get shippingFee(): number { return this.props.shippingFee; }
  get discountAmount(): number { return this.props.discountAmount; }
  get totalAmount(): number { return this.props.totalAmount; }
  get paymentMethod(): PaymentMethod { return this.props.paymentMethod; }
  get paymentStatus(): PaymentStatus { return this.props.paymentStatus; }
  get orderStatus(): OrderStatus { return this.props.orderStatus; }
  get internalNotes(): string | null | undefined { return this.props.internalNotes; }
  get idempotencyKey(): string | null | undefined { return this.props.idempotencyKey; }
  get items(): OrderItem[] { return this.props.items; }
  get createdAt(): Date { return this.props.createdAt || new Date(); }
  get updatedAt(): Date { return this.props.updatedAt || new Date(); }

  // State Transition Methods
  public cancel(reason?: string): void {
    if (this.props.orderStatus === OrderStatus.completed) {
      throw new BusinessRuleViolationException('Không thể hủy đơn hàng đã hoàn thành giao dịch.');
    }
    if (this.props.orderStatus === OrderStatus.cancelled) {
      throw new BusinessRuleViolationException('Đơn hàng này đã được hủy trước đó.');
    }
    this.props.orderStatus = OrderStatus.cancelled;
    if (reason) {
      this.props.internalNotes = this.props.internalNotes
        ? `${this.props.internalNotes} | Lý do hủy: ${reason}`
        : `Lý do hủy: ${reason}`;
    }
    this.props.updatedAt = new Date();
  }

  public markAsPaid(): void {
    this.props.paymentStatus = PaymentStatus.paid;
    this.props.updatedAt = new Date();
  }

  public updateStatus(newStatus: OrderStatus, note?: string): void {
    this.props.orderStatus = newStatus;
    if (note) {
      this.props.internalNotes = this.props.internalNotes
        ? `${this.props.internalNotes} | ${note}`
        : note;
    }
    this.props.updatedAt = new Date();
  }
}

