import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { IOrderRepository, OrderQueryFilters } from '../../domain/repositories/order.repository.interface';
import { Order } from '../../domain/entities/order.entity';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class PrismaOrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Order | null> {
    const raw = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    return raw ? OrderMapper.toDomain(raw) : null;
  }

  async findByOrderCode(orderCode: string): Promise<Order | null> {
    const raw = await this.prisma.order.findUnique({
      where: { orderCode },
      include: { items: true },
    });
    return raw ? OrderMapper.toDomain(raw) : null;
  }

  async findByIdempotencyKey(key: string): Promise<Order | null> {
    const raw = await this.prisma.order.findUnique({
      where: { idempotencyKey: key },
      include: { items: true },
    });
    return raw ? OrderMapper.toDomain(raw) : null;
  }

  async findByCodeAndPhone(orderCode: string, phone: string): Promise<Order | null> {
    const raw = await this.prisma.order.findFirst({
      where: {
        orderCode,
        customerPhone: phone,
      },
      include: { items: true },
    });
    return raw ? OrderMapper.toDomain(raw) : null;
  }

  async findAll(filters: OrderQueryFilters = {}): Promise<{ orders: Order[]; total: number }> {
    const where: any = {};

    if (filters.status) {
      where.orderStatus = filters.status;
    }
    if (filters.userId) {
      where.userId = filters.userId;
    }
    if (filters.search) {
      where.OR = [
        { orderCode: { contains: filters.search, mode: 'insensitive' } },
        { customerName: { contains: filters.search, mode: 'insensitive' } },
        { customerPhone: { contains: filters.search } },
      ];
    }
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: filters.skip,
        take: filters.take,
        include: { items: true },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      orders: items.map(OrderMapper.toDomain),
      total,
    };
  }

  async save(order: Order): Promise<Order> {
    const data = OrderMapper.toPersistence(order);
    const created = await this.prisma.order.create({
      data,
      include: { items: true },
    });
    return OrderMapper.toDomain(created);
  }

  async update(order: Order): Promise<Order> {
    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        internalNotes: order.internalNotes,
      },
      include: { items: true },
    });
    return OrderMapper.toDomain(updated);
  }

  async countByStatus(status: OrderStatus): Promise<number> {
    return await this.prisma.order.count({ where: { orderStatus: status } });
  }

  async calculateTotalRevenue(): Promise<number> {
    const aggregations = await this.prisma.order.aggregate({
      where: {
        orderStatus: { in: [OrderStatus.completed, OrderStatus.shipping, OrderStatus.processing] },
        paymentStatus: { not: 'failed' },
      },
      _sum: {
        totalAmount: true,
      },
    });
    return Number(aggregations._sum.totalAmount || 0);
  }
}

