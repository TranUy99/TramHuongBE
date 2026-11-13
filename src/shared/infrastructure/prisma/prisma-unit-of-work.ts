import { Injectable } from '@nestjs/common';
import { IUnitOfWork } from '../../application/ports/unit-of-work.port';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private readonly prisma: PrismaService) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(async () => {
      return await operation();
    });
  }
}

