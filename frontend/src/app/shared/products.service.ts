import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private http: HttpClient) {}

  create(product: Product): Observable<Product> {
    const request_url = `${environment.backendApiUrl}/products/`;
    return this.http.post<Product>(request_url, product);
  }

  getAll(
    category_id: number = 0,
    manufacturer_id: number = 0,
    offset: number = 0,
    limit: number = 200
  ): Observable<Product[]> {
    const request_url = `${environment.backendApiUrl}/products/`;
    let params = new HttpParams();
    params = params.append('offset', offset);
    params = params.append('limit', limit);
    params = params.append('category_id', category_id);
    params = params.append('manufacturer_id', manufacturer_id);
    return this.http.get<Product[]>(request_url, { params: params });
  }

  get_by_id_list(id_list: number[]): Observable<Product[]> {
    const request_url = `${environment.backendApiUrl}/products/by-id-list`;
    return this.http.post<Product[]>(request_url, { ids: id_list });
  }

  remove(id: number): Observable<void> {
    const request_url = `${environment.backendApiUrl}/products/${id}`;
    return this.http.delete<void>(request_url);
  }

  getById(id: number): Observable<Product> {
    const request_url = `${environment.backendApiUrl}/products/${id}`;
    return this.http.get<Product>(request_url);
  }

  update(product: Product): Observable<Product> {
    const request_url = `${environment.backendApiUrl}/products/${product.id}`;
    return this.http.put<Product>(request_url, product);
  }
}
