import { BaseEntity } from '../../../../shared/domain/entity.base';
import { BusinessRuleViolationException, InsufficientStockException } from '../../../../shared/domain/exceptions/domain.exception';

export interface ProductVariantProps {
  id?: string;
  sku: string;
  name: string;
  price: number;
  salePrice?: number | null;
  stockQuantity: number;
  weightGrams?: number;
}

export interface ProductProps {
  categoryId?: string | null;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string | null;
  description?: string | null;
  specifications?: Record<string, any>;
  basePrice: number;
  salePrice?: number | null;
  stockQuantity: number;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  variants?: ProductVariantProps[];
  images?: Array<{ id?: string; imageUrl: string; altText?: string; displayOrder?: number; isPrimary?: boolean }>;
}

export class Product extends BaseEntity<ProductProps> {
  private constructor(props: ProductProps, id?: string) {
    super(props, id);
  }

  public static create(props: ProductProps, id?: string): Product {
    if (!props.name || props.name.trim().length === 0) {
      throw new BusinessRuleViolationException('Tên sản phẩm không được để trống.');
    }
    if (!props.sku || props.sku.trim().length === 0) {
      throw new BusinessRuleViolationException('Mã SKU không được để trống.');
    }
    if (props.basePrice < 0) {
      throw new BusinessRuleViolationException('Giá gốc sản phẩm không được là số âm.');
    }
    if (props.salePrice !== undefined && props.salePrice !== null) {
      if (props.salePrice < 0) {
        throw new BusinessRuleViolationException('Giá khuyến mãi không được âm.');
      }
      if (props.salePrice > props.basePrice) {
        throw new BusinessRuleViolationException('Giá khuyến mãi không được lớn hơn giá gốc.');
      }
    }
    if (props.stockQuantity < 0) {
      throw new BusinessRuleViolationException('Số lượng tồn kho không được âm.');
    }

    return new Product(
      {
        ...props,
        isActive: props.isActive ?? true,
        isFeatured: props.isFeatured ?? false,
        specifications: props.specifications ?? {},
        variants: props.variants ?? [],
        images: props.images ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    );
  }

  // Getters
  get name(): string { return this.props.name; }
  get slug(): string { return this.props.slug; }
  get sku(): string { return this.props.sku; }
  get categoryId(): string | null | undefined { return this.props.categoryId; }
  get shortDescription(): string | null | undefined { return this.props.shortDescription; }
  get description(): string | null | undefined { return this.props.description; }
  get specifications(): Record<string, any> { return this.props.specifications || {}; }
  get basePrice(): number { return this.props.basePrice; }
  get salePrice(): number | null | undefined { return this.props.salePrice; }
  get stockQuantity(): number { return this.props.stockQuantity; }
  get isFeatured(): boolean { return this.props.isFeatured ?? false; }
  get isActive(): boolean { return this.props.isActive ?? true; }
  get createdAt(): Date { return this.props.createdAt || new Date(); }
  get updatedAt(): Date { return this.props.updatedAt || new Date(); }
  get variants(): ProductVariantProps[] { return this.props.variants || []; }
  get images(): any[] { return this.props.images || []; }

  // Business Methods
  public deductStock(qty: number): void {
    if (qty <= 0) {
      throw new BusinessRuleViolationException('Số lượng xuất kho phải lớn hơn 0.');
    }
    if (this.props.stockQuantity < qty) {
      throw new InsufficientStockException(this.props.name, this.props.stockQuantity, qty);
    }
    this.props.stockQuantity -= qty;
    this.props.updatedAt = new Date();
  }

  public restoreStock(qty: number): void {
    if (qty <= 0) {
      throw new BusinessRuleViolationException('Số lượng hoàn kho phải lớn hơn 0.');
    }
    this.props.stockQuantity += qty;
    this.props.updatedAt = new Date();
  }

  public updateDetails(props: Partial<ProductProps>): void {
    if (props.name !== undefined) {
      if (!props.name.trim()) throw new BusinessRuleViolationException('Tên sản phẩm không hợp lệ.');
      this.props.name = props.name;
    }
    if (props.slug !== undefined) {
      if (!props.slug.trim()) throw new BusinessRuleViolationException('Slug sản phẩm không hợp lệ.');
      this.props.slug = props.slug;
    }
    if (props.categoryId !== undefined) {
      this.props.categoryId = props.categoryId;
    }
    if (props.basePrice !== undefined) {
      if (props.basePrice < 0) throw new BusinessRuleViolationException('Giá gốc không được âm.');
      this.props.basePrice = props.basePrice;
    }
    if (props.salePrice !== undefined) {
      if (props.salePrice !== null && props.salePrice < 0) {
        throw new BusinessRuleViolationException('Giá khuyến mãi không được âm.');
      }
      if (props.salePrice !== null && props.salePrice > this.props.basePrice) {
        throw new BusinessRuleViolationException('Giá khuyến mãi không được vượt quá giá gốc.');
      }
      this.props.salePrice = props.salePrice;
    }
    if (props.stockQuantity !== undefined) {
      if (props.stockQuantity < 0) throw new BusinessRuleViolationException('Tồn kho không được âm.');
      this.props.stockQuantity = props.stockQuantity;
    }
    if (props.description !== undefined) this.props.description = props.description;
    if (props.shortDescription !== undefined) this.props.shortDescription = props.shortDescription;
    if (props.specifications !== undefined) this.props.specifications = props.specifications;
    if (props.isActive !== undefined) this.props.isActive = props.isActive;
    if (props.isFeatured !== undefined) this.props.isFeatured = props.isFeatured;
    this.props.updatedAt = new Date();
  }
}

