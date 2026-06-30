export type Product = {
  id: string;
  name: string;
  barcode: string;
  sku: string | null;
  description: string | null;
  price: string;
  stock: number;
  location: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ScanAction = "ADD_STOCK" | "REMOVE_STOCK" | "SALE" | "CHECK";

export type ScanLog = {
  id: string;
  productId: string | null;
  barcode: string;
  action: ScanAction;
  quantity: number;
  createdAt: string;
  product: Product | null;
};

export type DashboardData = {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  outOfStock: number;
  todayScans: number;
  recentScans: ScanLog[];
};


export type ExternalProduct = {
  name: string;
  description: string;
  imageUrl: string;
  brand?: string;
  category?: string;
};

export type ProductDraft = {
  barcode: string;
  name: string;
  description: string;
  imageUrl: string;
};

export type SearchResponse = {
  found: boolean;
  source: "local" | "upcitemdb" | null;
  product: Product | null;
  externalProduct: ExternalProduct | null;
};