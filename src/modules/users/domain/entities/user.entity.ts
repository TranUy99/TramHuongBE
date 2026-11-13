import { BaseEntity } from '../../../../shared/domain/entity.base';
import { UserRole } from './user-role.enum';
import * as bcrypt from 'bcrypt';

export { UserRole };

export interface UserProps {
  email: string;
  passwordHash: string;
  fullName?: string | null;
  phone?: string | null;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends BaseEntity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(props: UserProps, id?: string): User {
    return new User(
      {
        ...props,
        role: props.role || UserRole.customer,
        createdAt: props.createdAt || new Date(),
        updatedAt: props.updatedAt || new Date(),
      },
      id
    );
  }

  get email(): string { return this.props.email; }
  get passwordHash(): string { return this.props.passwordHash; }
  get fullName(): string | null | undefined { return this.props.fullName; }
  get phone(): string | null | undefined { return this.props.phone; }
  get role(): UserRole { return this.props.role; }
  get avatarUrl(): string | null | undefined { return this.props.avatarUrl; }
  get createdAt(): Date { return this.props.createdAt || new Date(); }
  get updatedAt(): Date { return this.props.updatedAt || new Date(); }

  public async validatePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.props.passwordHash);
  }
}

