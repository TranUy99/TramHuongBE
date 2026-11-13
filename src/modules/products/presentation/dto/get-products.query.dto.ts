import { IsOptional, IsString, IsNumber, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsQueryDto {
  @IsString()
  @IsOptional()
  categorySlug?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  minPrice?: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  @IsOptional()
  maxPrice?: number;

  @IsIn(['price_asc', 'price_desc', 'newest'])
  @IsOptional()
  sort?: 'price_asc' | 'price_desc' | 'newest';

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 12;
}

