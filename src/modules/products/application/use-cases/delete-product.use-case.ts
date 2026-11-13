import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async execute(id: string): Promise<{ deleted: boolean; id: string }> {
    const product = await this.productRepo.findById(id);
    if (!product) {
      throw new NotFoundException(`Không tìm thấy sản phẩm với ID "${id}".`);
    }

    await this.productRepo.delete(id);
    return { deleted: true, id };
  }
}

