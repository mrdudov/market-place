import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EditOrder, Order, OrderProduct, OrderStatus } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Order[]> {
    const request_url = `${environment.backendApiUrl}/orders/`;
    return this.http.get<Order[]>(request_url);
  }

  create(order: Order): Observable<Order> {
    const request_url = `${environment.backendApiUrl}/orders/`;
    return this.http.post<Order>(request_url, order);
  }

  add_products(
    order_id: number,
    order_product: OrderProduct[]
  ): Observable<Order> {
    const request_url = `${environment.backendApiUrl}/orders/${order_id}/add-products`;
    return this.http.post<Order>(request_url, order_product);
  }

  edit_products(
    order_id: number,
    order_product: OrderProduct[]
  ): Observable<Order> {
    const request_url = `${environment.backendApiUrl}/orders/${order_id}/edit-products`;
    return this.http.post<Order>(request_url, order_product);
  }

  remove_products(
    order_id: number,
    product_id_list: number[]
  ): Observable<Order> {
    const request_url = `${environment.backendApiUrl}/orders/${order_id}/remove-products`;
    return this.http.post<Order>(request_url, product_id_list);
  }

  remove(id: number): Observable<void> {
    const request_url = `${environment.backendApiUrl}/orders/${id}`;
    return this.http.delete<void>(request_url);
  }

  getById(id: number): Observable<Order> {
    const request_url = `${environment.backendApiUrl}/orders/${id}`;
    return this.http.get<Order>(request_url);
  }

  update_status(
    order_id: number,
    order_status: OrderStatus
  ): Observable<Order> {
    const request_url = `${environment.backendApiUrl}/orders/${order_id}/set-status/`;
    return this.http.put<Order>(request_url, order_status);
  }

  update_order(order_id: number, edit_order: EditOrder): Observable<Order> {
    const request_url = `${environment.backendApiUrl}/orders/${order_id}`;
    return this.http.put<Order>(request_url, edit_order);
  }
}

export function getOrderStatus(state: OrderStatus) {
  switch (state) {
    case OrderStatus.ACCEPTED:
      return 'Принят';
    case OrderStatus.CREATED:
      return 'Создан';
    case OrderStatus.FINISHED:
      return 'Завершен';
    case OrderStatus.PROCESSING:
      return 'В обработке';
    case OrderStatus.REJECTED:
      return 'Отменен';
    default:
      return 'unknown';
  }
}
