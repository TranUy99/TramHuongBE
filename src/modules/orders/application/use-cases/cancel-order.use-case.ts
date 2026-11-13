import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import { IProductRepository, PRODUCT_REPOSITORY } from '../../../products/domain/repositories/product.repository.interface';
import { IUnitOfWork, UNIT_OF_WORK } from '../../../../shared/application/ports/unit-of-work.port';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: IUnitOfWork,
  ) {}

  async execute(orderId: string, reason = 'Khách hàng yêu cầu hủy đơn'): Promise<{ success: boolean; message: string }> {
    return await this.unitOfWork.execute(async () => {
      const order = await this.orderRepo.findById(orderId);
      if (!order) {
        throw new NotFoundException(`Không tìm thấy đơn hàng với ID "${orderId}".`);
      }

      // Domain method enforces rule: cannot cancel completed or already cancelled orders
      order.cancel(reason);

      // Hoàn trả lại tồn kho từng item
      for (const item of order.items) {
        if (item.productId) {
          await this.productRepo.restoreStock(
            item.productId,
            item.quantity,
            item.variantId || undefined
          );
        }
      }

      await this.orderRepo.update(order);

      return {
        success: true,
        message: `Đã hủy đơn hàng ${order.orderCode} và hoàn trả tồn kho thành công.`,
      };
    });
  }
}

