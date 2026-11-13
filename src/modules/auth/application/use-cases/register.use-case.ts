import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../users/domain/repositories/user.repository.interface';
import { User, UserRole } from '../../../users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(params: { email: string; password: string; fullName?: string; phone?: string; role?: UserRole }) {
    const cleanEmail = params.email.toLowerCase().trim();
    const existing = await this.userRepo.findByEmail(cleanEmail);
    if (existing) {
      throw new ConflictException(`Tài khoản với email "${cleanEmail}" đã tồn tại.`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(params.password, salt);

    const user = User.create({
      email: cleanEmail,
      passwordHash,
      fullName: params.fullName || null,
      phone: params.phone || null,
      role: params.role || UserRole.customer,
    });

    const saved = await this.userRepo.save(user);

    return {
      id: saved.id,
      email: saved.email,
      fullName: saved.fullName,
      role: saved.role,
    };
  }
}

