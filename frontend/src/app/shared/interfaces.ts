export enum OrderStatus {
  CREATED = 'CREATED',
  ACCEPTED = 'ACCEPTED',
  PROCESSING = 'PROCESSING',
  REJECTED = 'REJECTED',
  FINISHED = 'FINISHED',
}

export interface Category {
  id?: number;
  name: string;
  description: string;
  is_active: boolean;
  date: Date;
}

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  manufacturer_price: number;
  shipping_cost_coefficient: number;
  category_id: number;
  manufacturer_id: number;
  unit_of_measurement_id: Number;
}

export interface Manufacturer {
  id?: number;
  name: string;
  description: string;
  address: string;
}

export interface ProductWithCount {
  id?: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  product_count: number;
}

export interface OrderProduct {
  product_id: number;
  product_count: number;
}

export interface Order {
  id?: number;
  order_status: OrderStatus;
  distance: number;
  price: number;
  products?: OrderProduct[];
}

export interface EditOrder {
  order_status: OrderStatus;
  distance: number;
  price: number;
}

export interface UnitOfMeasurement {
  id?: number;
  unit: string;
  description: string;
}
