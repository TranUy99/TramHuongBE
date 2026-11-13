import { BaseEntity } from '../../../../shared/domain/entity.base';
import { BusinessRuleViolationException } from '../../../../shared/domain/exceptions/domain.exception';

export interface OrderItemProps {
  productId?: string | null;
  variantId?: string | null;
  productName: string;
  variantName?: string | null;
  sku: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  specificationsSnapshot?: Record<string, any> | null;
}

export class OrderItem extends BaseEntity<OrderItemProps> {
  private constructor(props: OrderItemProps, id?: string) {
    super(props, id);
  }

  public static create(props: OrderItemProps, id?: string): OrderItem {
    if (!props.productName || props.productName.trim().length === 0) {
      throw new BusinessRuleViolationException('Tên sản phẩm snapshot không được để trống.');
    }
    if (props.unitPrice < 0) {
      throw new BusinessRuleViolationException('Đơn giá không được âm.');
    }
    if (props.quantity <= 0) {
      throw new BusinessRuleViolationException('Số lượng sản phẩm đặt mua phải lớn hơn 0.');
    }

    const calculatedTotal = props.unitPrice * props.quantity;

    return new OrderItem(
      {
        ...props,
        totalPrice: calculatedTotal,
      },
      id
    );
  }

  get productId(): string | null | undefined { return this.props.productId; }
  get variantId(): string | null | undefined { return this.props.variantId; }
  get productName(): string { return this.props.productName; }
  get variantName(): string | null | undefined { return this.props.variantName; }
  get sku(): string { return this.props.sku; }
  get unitPrice(): number { return this.props.unitPrice; }
  get quantity(): number { return this.props.quantity; }
  get totalPrice(): number { return this.props.totalPrice; }
  get specificationsSnapshot(): Record<string, any> | null | undefined {
    return this.props.specificationsSnapshot;
  }
}

