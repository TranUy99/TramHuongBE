import { BaseEntity } from '../../../../shared/domain/entity.base';
import { BusinessRuleViolationException } from '../../../../shared/domain/exceptions/domain.exception';

export interface CategoryProps {
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Category extends BaseEntity<CategoryProps> {
  private constructor(props: CategoryProps, id?: string) {
    super(props, id);
  }

  public static create(props: CategoryProps, id?: string): Category {
    if (!props.name || props.name.trim().length === 0) {
      throw new BusinessRuleViolationException('Tên danh mục không được để trống.');
    }
    if (!props.slug || props.slug.trim().length === 0) {
      throw new BusinessRuleViolationException('Slug danh mục không được để trống.');
    }

    return new Category(
      {
        ...props,
        displayOrder: props.displayOrder ?? 0,
        isActive: props.isActive ?? true,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  get name(): string { return this.props.name; }
  get slug(): string { return this.props.slug; }
  get description(): string | null | undefined { return this.props.description; }
  get imageUrl(): string | null | undefined { return this.props.imageUrl; }
  get displayOrder(): number { return this.props.displayOrder ?? 0; }
  get isActive(): boolean { return this.props.isActive ?? true; }
  get createdAt(): Date { return this.props.createdAt || new Date(); }
  get updatedAt(): Date { return this.props.updatedAt || new Date(); }

  public updateDetails(props: Partial<CategoryProps>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) throw new BusinessRuleViolationException('Tên danh mục không được để trống.');
      this.props.name = props.name;
    }
    if (props.slug !== undefined) {
      if (!props.slug.trim()) throw new BusinessRuleViolationException('Slug danh mục không được để trống.');
      this.props.slug = props.slug;
    }
    if (props.description !== undefined) this.props.description = props.description;
    if (props.imageUrl !== undefined) this.props.imageUrl = props.imageUrl;
    if (props.displayOrder !== undefined) this.props.displayOrder = props.displayOrder;
    if (props.isActive !== undefined) this.props.isActive = props.isActive;
    this.props.updatedAt = new Date();
  }
}

