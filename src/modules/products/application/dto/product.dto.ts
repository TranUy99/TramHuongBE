export interface CreateProductCommand {
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
  variants?: Array<{
    sku: string;
    name: string;
    price: number;
    salePrice?: number | null;
    stockQuantity: number;
    weightGrams?: number;
  }>;
  imageUrls?: string[];
}

export interface UpdateProductCommand {
  id: string;
  categoryId?: string | null;
  name?: string;
  slug?: string;
  shortDescription?: string | null;
  description?: string | null;
  specifications?: Record<string, any>;
  basePrice?: number;
  salePrice?: number | null;
  stockQuantity?: number;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface ProductResultDto {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  specifications: Record<string, any>;
  basePrice: number;
  salePrice?: number | null;
  stockQuantity: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  variants?: any[];
  images?: any[];
}

