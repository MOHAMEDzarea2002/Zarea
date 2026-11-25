export type Variant = {
  _id: string;
  color: string;
  size: string;
  stock: number;
};

// الفئة بتيجي populated جوه المنتج
export type ProductCategory = {
  _id: string;
  name: string;
  image?: string;
};

export type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  category: ProductCategory;
  images: string[];
  variants: Variant[];
  status: string; // 'active' أو غيرها
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  _id: string;
  name: string;
  image: string;
  alt: string;
};

export type Pagination = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
};

export type ProductsResponse = {
  data: Product[];
  pagination: Pagination;
};

export type SingleProductResponse = {
  success: boolean;
  data: Product;
};

export type SortOption = 'newest' | 'price_asc' | 'price_desc';

// البارامترات اللي بتتبعت للـ API — عدّل الأسماء حسب الـ backend
export type ProductsQuery = {
  page?: number;
  limit?: number;
  sort?: SortOption;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};

/* ---------- Auth ---------- */
export type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export type LoginBody = { email: string; password: string };
export type RegisterBody = LoginBody & { name: string; phone: string };
export type AuthResponse = { message: string; user: User };

/* ---------- Orders ---------- */
export type PaymentMethod = 'COD' | 'InstaPay';

export type ShippingAddress = {
  fullName: string;
  phone: string;
  city: string;
  street: string;
  building?: string;
  notes?: string;
};

export type OrderItem = {
  _id?: string;
  product: string | { _id: string }; // في getMyOrders بيرجع populated object
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type Order = {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentReference?: string; // رقم عملية InstaPay
  paymentStatus: 'Pending' | 'Paid';
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

// الـ backend بياخد المنتج والمقاس واللون والكمية بس، ويحسب السعر بنفسه
export type CreateOrderBody = {
  items: { product: string; size: string; color: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
};

export type CreateOrderResponse = { message: string; order: Order };
export type MyOrdersResponse = { message: string; orders: Order[] };
export type CancelOrderResponse = { message: string; order: Order };
