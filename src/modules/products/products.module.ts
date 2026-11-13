import { Module } from '@nestjs/common';
import { ProductsController } from './presentation/controllers/products.controller';
import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { GetProductBySlugUseCase } from './application/use-cases/get-product-by-slug.use-case';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository.interface';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';

@Module({
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    GetProductsUseCase,
    GetProductBySlugUseCase,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY, CreateProductUseCase, UpdateProductUseCase, DeleteProductUseCase, GetProductsUseCase],
})
export class ProductsModule {}

