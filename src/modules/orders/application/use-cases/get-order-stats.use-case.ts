import { Injectable, Inject } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import { OrderStatus } from '../../domain/entities/order.entity';

@Injectable()
export class GetOrderStatsUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute() {
    const [
      totalRevenue,
      pendingCount,
      confirmedCount,
      processingCount,
      shippingCount,
      completedCount,
      cancelledCount,
    ] = await Promise.all([
      this.orderRepo.calculateTotalRevenue(),
      this.orderRepo.countByStatus(OrderStatus.pending),
      this.orderRepo.countByStatus(OrderStatus.confirmed),
      this.orderRepo.countByStatus(OrderStatus.processing),
      this.orderRepo.countByStatus(OrderStatus.shipping),
      this.orderRepo.countByStatus(OrderStatus.completed),
      this.orderRepo.countByStatus(OrderStatus.cancelled),
    ]);

    return {
      totalRevenue,
      totalOrders: pendingCount + confirmedCount + processingCount + shippingCount + completedCount + cancelledCount,
      byStatus: {
        pending: pendingCount,
        confirmed: confirmedCount,
        processing: processingCount,
        shipping: shippingCount,
        completed: completedCount,
        cancelled: cancelledCount,
      },
    };
  }
}

