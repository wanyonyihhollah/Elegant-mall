export interface Product {
  id: string;
  title: string;
  sku: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  rating: number;
  inventory: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Promotion {
  id: string;
  title: string;
  code: string;
  discount: number; // percentage
  image?: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: 'mpesa' | 'card' | 'paypal';
  paymentStatus: 'pending' | 'completed' | 'failed';
  date: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  type: 'order_success' | 'cart_abandonment' | 'promotional';
  sentAt: string;
  etherealUrl?: string;
  previewUrl?: string;
}

