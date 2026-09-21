export interface Category {
  id: string;
  name: string;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface UserProfile {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image: string;
}

export interface Order {
  id?: string;
  userId: string;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "delivered"
    | "cancelled";
  total: number;
  createdAt: string;
  items: OrderItem[];
}