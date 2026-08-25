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

  category: ProductCategory | null;
  variants?: ProductVariant[];

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

export type Lot = {
  id: string;
  name: string;
  location: string | null;
  createdAt: string;
  updatedAt: string;
  items: LotItem[];
};

export type LotItem = {
  id: string;
  lotId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
};

export type PendingLotItem = {
  product: Product;
  quantity: number;
};

export type ProductCategory =
  | "FASHION"
  | "FOOD"
  | "ELECTRONICS"
  | "BEAUTY"
  | "HOME"
  | "OTHER";

export type ProductVariant = {
  id: string;
  productId: string;
  size: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};