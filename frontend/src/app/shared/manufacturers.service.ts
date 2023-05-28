import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Manufacturer } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class ManufacturersService {
  constructor(private http: HttpClient) {}

  create(manufacturer: Manufacturer): Observable<Manufacturer> {
    const request_url = `${environment.backendApiUrl}/manufacturers/`;
    return this.http.post<Manufacturer>(request_url, manufacturer);
  }

  getAll(offset: number = 0, limit: number = 200): Observable<Manufacturer[]> {
    const request_url = `${environment.backendApiUrl}/manufacturers/`;
    let params = new HttpParams();
    params = params.append('offset', offset);
    params = params.append('limit', limit);
    return this.http.get<Manufacturer[]>(request_url, { params: params });
  }

  get_by_id_list(id_list: number[]): Observable<Manufacturer[]> {
    const request_url = `${environment.backendApiUrl}/manufacturers/by-id-list/`;
    return this.http.post<Manufacturer[]>(request_url, { ids: id_list });
  }

  remove(id: number): Observable<void> {
    const request_url = `${environment.backendApiUrl}/manufacturers/${id}`;
    return this.http.delete<void>(request_url);
  }

  getById(id: string): Observable<Manufacturer> {
    const request_url = `${environment.backendApiUrl}/manufacturers/${id}`;
    return this.http.get<Manufacturer>(request_url);
  }

  update(manufacturer: Manufacturer): Observable<Manufacturer> {
    const request_url = `${environment.backendApiUrl}/manufacturers/${manufacturer.id}`;
    return this.http.put<Manufacturer>(request_url, manufacturer);
  }
}
