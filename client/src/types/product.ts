// product.ts
export interface Product {
  id: string;
  sellerId: string;
  seller: {
    storeName: string;
    storeSlug: string;
    isVerified: boolean;
    averageRating: number;
    user: { firstName: string; lastName: string };
  };
  name: string;
  slug: string;
  description: string;
  price: number; // in NGN (converted from kobo)
  comparePrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  stock: number;
  sku?: string;
  location: string;
  isActive: boolean;
  viewCount: number;
  salesCount: number;
  averageRating: number;
  reviewCount: number;
  tags: string[];
  sponsoredListing?: { plan: string; isActive: boolean } | null;
  createdAt: string;
}

export type ProductCategory = 'Electronics' | 'Fashion' | 'Beauty' | 'Home' | 'Food' | 'Sports' | 'Books' | 'Automotive';

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: string;
  stock: number;
  sku?: string;
  location: string;
  tags?: string[];
}