import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { GetProductsUseCase } from '../../application/use-cases/get-products.use-case';
import { GetProductBySlugUseCase } from '../../application/use-cases/get-product-by-slug.use-case';
import { CreateProductRequestDto } from '../dto/create-product.request.dto';
import { UpdateProductRequestDto } from '../dto/update-product.request.dto';
import { GetProductsQueryDto } from '../dto/get-products.query.dto';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/presentation/guards/roles.guard';
import { Roles } from '../../../../shared/presentation/decorators/roles.decorator';

@Controller('api/v1/products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductBySlugUseCase: GetProductBySlugUseCase,
  ) {}

  @Get()
  async findAll(@Query() query: GetProductsQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 12;
    const skip = (page - 1) * limit;

    const result = await this.getProductsUseCase.execute({
      categorySlug: query.categorySlug,
      search: query.search,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      sort: query.sort,
      skip,
      take: limit,
      isActive: true,
    });

    return {
      products: result.products,
      total: result.total,
      page,
      totalPages: Math.ceil(result.total / limit),
    };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return await this.getProductBySlugUseCase.execute(slug);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() dto: CreateProductRequestDto) {
    return await this.createProductUseCase.execute(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: UpdateProductRequestDto) {
    return await this.updateProductUseCase.execute({ id, ...dto });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return await this.deleteProductUseCase.execute(id);
  }
}

