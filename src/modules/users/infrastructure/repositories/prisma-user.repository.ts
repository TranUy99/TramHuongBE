import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/prisma/prisma.service';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(raw: any): User {
    return User.create(
      {
        email: raw.email,
        passwordHash: raw.passwordHash,
        fullName: raw.fullName,
        phone: raw.phone,
        role: raw.role,
        avatarUrl: raw.avatarUrl,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id
    );
  }

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { id } });
    return raw ? this.toDomain(raw) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({ where: { email } });
    return raw ? this.toDomain(raw) : null;
  }

  async save(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        email: user.email,
        passwordHash: user.passwordHash,
        fullName: user.fullName || null,
        phone: user.phone || null,
        role: user.role,
        avatarUrl: user.avatarUrl || null,
      },
    });
    return this.toDomain(created);
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: user.fullName || null,
        phone: user.phone || null,
        avatarUrl: user.avatarUrl || null,
      },
    });
    return this.toDomain(updated);
  }
}

