import { Controller, Get, Post, Patch, Delete, Query, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { GetCategoriesUseCase } from '../../application/use-cases/get-categories.use-case';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.use-case';
import { CreateCategoryRequestDto, UpdateCategoryRequestDto } from '../dto/category.request.dto';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/presentation/guards/roles.guard';
import { Roles } from '../../../../shared/presentation/decorators/roles.decorator';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  @Get()
  async findAll(@Query('all') all?: string) {
    const activeOnly = all !== 'true';
    return await this.getCategoriesUseCase.execute(activeOnly);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() dto: CreateCategoryRequestDto) {
    return await this.createCategoryUseCase.execute(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryRequestDto) {
    return await this.updateCategoryUseCase.execute({ id, ...dto });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return await this.deleteCategoryUseCase.execute(id);
  }
}
