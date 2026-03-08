export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  imageUrl: string;
  active: boolean;
}

export interface OrderDetailsResponse {
  id: number;
  totalAmount: number;
  status: string;
  items: ProductResponse[];
  createdAt: string;
}

export interface OrderItem {
  id: number;
  productId: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface OrderResponse {
  id: number;
  totalAmount: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
}
