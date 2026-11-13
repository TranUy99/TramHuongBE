import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class TrackOrderRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng cung cấp mã đơn hàng' })
  orderCode: string;

  @IsString()
  @Matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, { message: 'Số điện thoại không đúng định dạng' })
  customerPhone: string;
}

