import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus, PaymentStatus } from '../../domain/entities/order.entity';

export class UpdateOrderStatusRequestDto {
  @IsEnum(OrderStatus, { message: 'Trạng thái đơn hàng không hợp lệ' })
  @IsOptional()
  orderStatus?: OrderStatus;

  @IsEnum(PaymentStatus, { message: 'Trạng thái thanh toán không hợp lệ' })
  @IsOptional()
  paymentStatus?: PaymentStatus;

  @IsString()
  @IsOptional()
  internalNotes?: string;
}

