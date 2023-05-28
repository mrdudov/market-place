import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Category } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  create(category: Category): Observable<Category> {
    const request_url = `${environment.backendApiUrl}/categories/`;
    return this.http.post<Category>(request_url, category);
  }

  getAll(): Observable<Category[]> {
    const request_url = `${environment.backendApiUrl}/categories/`;
    return this.http.get<Category[]>(request_url);
  }

  remove(id: number): Observable<void> {
    const request_url = `${environment.backendApiUrl}/categories/${id}/`;
    return this.http.delete<void>(request_url);
  }

  getById(id: number): Observable<Category> {
    const request_url = `${environment.backendApiUrl}/categories/${id}/`;
    return this.http.get<Category>(request_url);
  }

  update(category: Category): Observable<Category> {
    const request_url = `${environment.backendApiUrl}/categories/${category.id}/`;
    return this.http.put<Category>(request_url, category);
  }
}
