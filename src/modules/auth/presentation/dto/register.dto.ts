import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu tối thiểu 6 ký tự' })
  password: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @Matches(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, { message: 'Số điện thoại không đúng định dạng' })
  @IsOptional()
  phone?: string;
}

