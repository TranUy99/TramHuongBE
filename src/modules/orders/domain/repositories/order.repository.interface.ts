import { Order, OrderStatus } from '../entities/order.entity';

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');

export interface OrderQueryFilters {
  status?: OrderStatus;
  search?: string; // Search by code, customer name or phone
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  skip?: number;
  take?: number;
}

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByOrderCode(orderCode: string): Promise<Order | null>;
  findByIdempotencyKey(key: string): Promise<Order | null>;
  findByCodeAndPhone(orderCode: string, phone: string): Promise<Order | null>;
  findAll(filters?: OrderQueryFilters): Promise<{ orders: Order[]; total: number }>;
  save(order: Order): Promise<Order>;
  update(order: Order): Promise<Order>;
  countByStatus(status: OrderStatus): Promise<number>;
  calculateTotalRevenue(): Promise<number>;
}

