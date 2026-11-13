import { Product } from '../entities/product.entity';

export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');

export interface ProductQueryFilters {
  categoryId?: string;
  categorySlug?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  skip?: number;
  take?: number;
}

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findAll(filters?: ProductQueryFilters): Promise<{ products: Product[]; total: number }>;
  save(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  deductStock(productId: string, quantity: number, variantId?: string): Promise<void>;
  restoreStock(productId: string, quantity: number, variantId?: string): Promise<void>;
}

