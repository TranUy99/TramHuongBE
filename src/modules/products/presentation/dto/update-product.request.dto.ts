import { IsString, IsNumber, Min, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProductRequestDto {
  @IsString()
  @IsOptional()
  categoryId?: string | null;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string | null;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsOptional()
  specifications?: Record<string, any>;

  @IsNumber()
  @Min(0, { message: 'Giá gốc không được là số âm' })
  @IsOptional()
  basePrice?: number;

  @IsNumber()
  @Min(0, { message: 'Giá khuyến mãi không được là số âm' })
  @IsOptional()
  salePrice?: number | null;

  @IsNumber()
  @Min(0, { message: 'Số lượng tồn kho không được âm' })
  @IsOptional()
  stockQuantity?: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

