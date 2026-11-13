import { Module } from '@nestjs/common';
import { OrdersController } from './presentation/controllers/orders.controller';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { TrackOrderUseCase } from './application/use-cases/track-order.use-case';
import { CancelOrderUseCase } from './application/use-cases/cancel-order.use-case';
import { UpdateOrderStatusUseCase } from './application/use-cases/update-order-status.use-case';
import { GetOrderStatsUseCase } from './application/use-cases/get-order-stats.use-case';
import { ORDER_REPOSITORY } from './domain/repositories/order.repository.interface';
import { PrismaOrderRepository } from './infrastructure/repositories/prisma-order.repository';
import { ProductsModule } from '../products/products.module';
import { UNIT_OF_WORK } from '../../shared/application/ports/unit-of-work.port';
import { PrismaUnitOfWork } from '../../shared/infrastructure/prisma/prisma-unit-of-work';

@Module({
  imports: [ProductsModule],
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    TrackOrderUseCase,
    CancelOrderUseCase,
    UpdateOrderStatusUseCase,
    GetOrderStatsUseCase,
    {
      provide: ORDER_REPOSITORY,
      useClass: PrismaOrderRepository,
    },
    {
      provide: UNIT_OF_WORK,
      useClass: PrismaUnitOfWork,
    },
  ],
  exports: [ORDER_REPOSITORY, CreateOrderUseCase, UpdateOrderStatusUseCase, GetOrderStatsUseCase],
})
export class OrdersModule {}

