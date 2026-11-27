// ---- Auth ----
export type Role = 'user' | 'admin';

export type User = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  createdAt?: string;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
};

export type Variant = {
  _id: string;
  color: string;
  size: string;
  stock: number;
};

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
  category?: ProductCategory | null;
  images: string[];
  variants: Variant[];
  status: string;
  createdAt: string;
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

export type ProductsQuery = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
};
// ---- Orders ----
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export type ShippingAddress = {
  fullName: string;
  phone: string;
  city: string;
  street: string;
  building?: string;
  notes?: string;
};

export type OrderItem = {
  product: string | Product;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  _id: string;
};

export type Order = {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'COD' | 'InstaPay';
  paymentStatus: 'Pending' | 'Paid';
  paymentReference?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type OrdersResponse = {
  orders: Order[];
};
// ---- Categories ----
export type Category = {
  _id: string;
  name: string;
  image: string;
  alt?: string;
};

export type CategoryInput = {
  name: string;
  image: string;
  alt?: string;
};


