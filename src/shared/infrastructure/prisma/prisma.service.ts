import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Đã kết nối thành công tới PostgreSQL cơ sở dữ liệu Mộc Trầm');
    } catch (error) {
      this.logger.warn(`Chưa thể kết nối tới PostgreSQL (kiểm tra DATABASE_URL): ${error.message}`);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Đã ngắt kết nối cơ sở dữ liệu');
  }
}

