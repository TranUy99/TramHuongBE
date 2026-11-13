import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import { OrderStatus, PaymentStatus } from '../../domain/entities/order.entity';

export interface UpdateOrderStatusCommand {
  orderId: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  internalNotes?: string;
}

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  async execute(command: UpdateOrderStatusCommand) {
    const order = await this.orderRepo.findById(command.orderId);
    if (!order) {
      throw new NotFoundException(`Không tìm thấy đơn hàng với ID "${command.orderId}".`);
    }

    if (command.orderStatus !== undefined) {
      order.updateStatus(command.orderStatus, command.internalNotes);
    } else if (command.internalNotes) {
      order.updateStatus(order.orderStatus, command.internalNotes);
    }

    if (command.paymentStatus === PaymentStatus.paid) {
      order.markAsPaid();
    }

    const updated = await this.orderRepo.update(order);
    return {
      id: updated.id,
      orderCode: updated.orderCode,
      orderStatus: updated.orderStatus,
      paymentStatus: updated.paymentStatus,
      internalNotes: updated.internalNotes,
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}

