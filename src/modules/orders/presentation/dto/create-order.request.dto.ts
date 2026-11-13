import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  Matches,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../../domain/entities/order.entity';

export class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsOptional()
  variantId?: string;

  @IsNumber()
  @Min(1, { message: 'Số lượng mua phải từ 1 trở lên' })
  quantity: number;
}

export class CreateOrderRequestDto {
  @IsString()
  @IsOptional()
  idempotencyKey?: string;

  @IsString()
  @IsNotEmpty({ message: 'Họ và tên không được để trống' })
  customerName: string;

  @IsString()
  @Matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, { message: 'Số điện thoại không đúng định dạng Việt Nam' })
  customerPhone: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsOptional()
  customerEmail?: string;

  @IsString()
  @IsNotEmpty({ message: 'Tỉnh/Thành phố không được để trống' })
  shippingProvince: string;

  @IsString()
  @IsOptional()
  shippingDistrict?: string;

  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ chi tiết không được để trống' })
  shippingAddress: string;

  @IsString()
  @IsOptional()
  orderNotes?: string;

  @IsEnum(PaymentMethod, { message: 'Phương thức thanh toán phải là cod hoặc bank_transfer' })
  paymentMethod: PaymentMethod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}

