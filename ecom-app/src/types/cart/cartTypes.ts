export interface CartItem {
  id: number;
  userId: string;
  keycloakId: string;
  productId: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItemRequest {
  productId: number;
  quantity: number;
}
