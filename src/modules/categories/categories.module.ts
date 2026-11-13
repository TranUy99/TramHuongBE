import { Module } from '@nestjs/common';
import { CategoriesController } from './presentation/controllers/categories.controller';
import { GetCategoriesUseCase } from './application/use-cases/get-categories.use-case';
import { CreateCategoryUseCase } from './application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from './application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from './application/use-cases/delete-category.use-case';
import { CATEGORY_REPOSITORY } from './domain/repositories/category.repository.interface';
import { PrismaCategoryRepository } from './infrastructure/repositories/prisma-category.repository';

@Module({
  controllers: [CategoriesController],
  providers: [
    GetCategoriesUseCase,
    CreateCategoryUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    {
      provide: CATEGORY_REPOSITORY,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [CATEGORY_REPOSITORY, GetCategoriesUseCase, CreateCategoryUseCase, UpdateCategoryUseCase, DeleteCategoryUseCase],
})
export class CategoriesModule {}

