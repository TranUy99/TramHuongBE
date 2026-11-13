import { IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVariantDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  weightGrams?: number;
}

export class CreateProductRequestDto {
  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Đường dẫn slug không được để trống' })
  slug: string;

  @IsString()
  @IsNotEmpty({ message: 'Mã SKU không được để trống' })
  sku: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  specifications?: Record<string, any>;

  @IsNumber()
  @Min(0, { message: 'Giá gốc không được là số âm' })
  basePrice: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @IsNumber()
  @Min(0, { message: 'Số lượng tồn kho không được âm' })
  stockQuantity: number;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  @IsOptional()
  variants?: CreateVariantDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  imageUrls?: string[];
}

