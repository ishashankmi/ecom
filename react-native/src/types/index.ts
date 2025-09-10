export interface Product {
  id: number;
  name: string;
  price: number;
  mrp: number;
  image?: string;
  description?: string;
  category: string;
  rating?: number;
  inventory?: number;
}

export interface CartProduct {
  id: string;
  title: string;
  subTitle: string;
  image?: string;
  price: number;
  mrp: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  totalPrice: number;
  billPrice: number;
  discount: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  color?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
  address: string;
}