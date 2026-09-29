export type Role = 'CUSTOMER' | 'OPERATOR';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: Role;
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export type MachineStatus = 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';

export interface VendingMachine {
  id: string; // e.g. VG-YTL-001
  name: string; // e.g. Tech Block A - Ground Floor
  location: string; // e.g. Government College of Engineering, Yavatmal
  description: string;
  status: MachineStatus;
  contactPhone: string;
  totalSlots: number;
  availableSlots: number;
  temperature?: string; // e.g. 4°C (chilled)
  lastServiced?: string;
  qrPayload?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
}

export type ProductStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'DISCONTINUED';

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  price: number; // in INR ₹
  mrp?: number;
  stock: number;
  machineId: string; // Assigned vending machine
  status: ProductStatus;
  image: string;
  unit: string; // e.g. "50g", "250ml", "1 pc"
  calories?: string; // e.g. "140 kcal"
  rating?: number; // e.g. 4.8
  ratingCount?: number;
  isBestseller?: boolean;
  isVegetarian?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'UPI' | 'CARD' | 'WALLET' | 'CASH_AT_MACHINE';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  unit: string;
}

export interface Order {
  id: string; // e.g. VGORD-10245
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  machineId: string;
  machineName?: string;
  machineLocation?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
  pickupOtp: string; // 4 digit dispense code e.g. 7421
  dispenseStatus?: 'WAITING_FOR_DISPENSE' | 'DISPENSING' | 'DISPENSED' | 'FAILED';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OperatorAnalytics {
  totalMachines: number;
  activeMachines: number;
  totalProducts: number;
  lowStockCount: number;
  todayOrdersCount: number;
  todayRevenue: number;
  totalRevenue: number;
  totalOrders: number;
  dailySales: { date: string; sales: number; orders: number }[];
  categorySales: { category: string; sales: number; itemsSold: number }[];
  machinePerformance: { machineId: string; machineName: string; sales: number; orders: number; stockHealth: number }[];
  recentOrders: Order[];
  lowStockProducts: Product[];
}
