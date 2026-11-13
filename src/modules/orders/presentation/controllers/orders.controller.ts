import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { TrackOrderUseCase } from '../../application/use-cases/track-order.use-case';
import { CancelOrderUseCase } from '../../application/use-cases/cancel-order.use-case';
import { UpdateOrderStatusUseCase } from '../../application/use-cases/update-order-status.use-case';
import { GetOrderStatsUseCase } from '../../application/use-cases/get-order-stats.use-case';
import { CreateOrderRequestDto } from '../dto/create-order.request.dto';
import { TrackOrderRequestDto } from '../dto/track-order.request.dto';
import { UpdateOrderStatusRequestDto } from '../dto/update-order-status.request.dto';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/presentation/guards/roles.guard';
import { Roles } from '../../../../shared/presentation/decorators/roles.decorator';
import { IOrderRepository, ORDER_REPOSITORY } from '../../domain/repositories/order.repository.interface';
import { Inject } from '@nestjs/common';
import { OrderStatus } from '../../domain/entities/order.entity';

@Controller('api/v1/orders')
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly trackOrderUseCase: TrackOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly getOrderStatsUseCase: GetOrderStatsUseCase,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepo: IOrderRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateOrderRequestDto) {
    return await this.createOrderUseCase.execute(dto);
  }

  @Post('track')
  @HttpCode(HttpStatus.OK)
  async track(@Body() dto: TrackOrderRequestDto) {
    return await this.trackOrderUseCase.execute(dto.orderCode, dto.customerPhone);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancel(@Param('id') id: string, @Body('reason') reason?: string) {
    return await this.cancelOrderUseCase.execute(id, reason);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(
    @Query('status') status?: OrderStatus,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const skip = (Number(page) - 1) * Number(limit);
    const { orders, total } = await this.orderRepo.findAll({
      status,
      search,
      skip,
      take: Number(limit),
    });

    return {
      orders: orders.map((o) => ({
        id: o.id,
        orderCode: o.orderCode,
        customerName: o.customerName,
        customerPhone: o.customerPhone,
        totalAmount: o.totalAmount,
        paymentMethod: o.paymentMethod,
        orderStatus: o.orderStatus,
        paymentStatus: o.paymentStatus,
        createdAt: o.createdAt.toISOString(),
      })),
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getStats() {
    return await this.getOrderStatsUseCase.execute();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusRequestDto) {
    return await this.updateOrderStatusUseCase.execute({
      orderId: id,
      orderStatus: dto.orderStatus,
      paymentStatus: dto.paymentStatus,
      internalNotes: dto.internalNotes,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findOne(@Param('id') id: string) {
    const order = await this.orderRepo.findById(id);
    if (!order) {
      return null;
    }
    return {
      id: order.id,
      orderCode: order.orderCode,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      shippingAddress: order.shippingAddress,
      shippingProvince: order.shippingProvince,
      shippingDistrict: order.shippingDistrict,
      orderNotes: order.orderNotes,
      subtotal: order.subtotal,
      shippingFee: order.shippingFee,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((i) => ({
        id: i.id,
        productName: i.productName,
        variantName: i.variantName,
        sku: i.sku,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        totalPrice: i.totalPrice,
      })),
    };
  }
}

