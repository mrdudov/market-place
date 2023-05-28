import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnitOfMeasurement } from './interfaces';

@Injectable({
  providedIn: 'root',
})
export class UnitsOfMeasurementService {
  constructor(private http: HttpClient) {}

  create(
    unit_of_measurement: UnitOfMeasurement
  ): Observable<UnitOfMeasurement> {
    const request_url = `${environment.backendApiUrl}/unit-of-measurement/`;
    return this.http.post<UnitOfMeasurement>(request_url, unit_of_measurement);
  }

  getAll(
    offset: number = 0,
    limit: number = 200
  ): Observable<UnitOfMeasurement[]> {
    const request_url = `${environment.backendApiUrl}/unit-of-measurement/`;
    let params = new HttpParams();
    params = params.append('offset', offset);
    params = params.append('limit', limit);
    return this.http.get<UnitOfMeasurement[]>(request_url, { params: params });
  }

  remove(unit_of_measurement_id: number): Observable<void> {
    const request_url = `${environment.backendApiUrl}/unit-of-measurement/${unit_of_measurement_id}/`;
    return this.http.delete<void>(request_url);
  }

  getById(unit_of_measurement_id: number): Observable<UnitOfMeasurement> {
    const request_url = `${environment.backendApiUrl}/unit-of-measurement/${unit_of_measurement_id}/`;
    return this.http.get<UnitOfMeasurement>(request_url);
  }

  update(
    unit_of_measurement: UnitOfMeasurement
  ): Observable<UnitOfMeasurement> {
    const request_url = `${environment.backendApiUrl}/unit-of-measurement/${unit_of_measurement.id}/`;
    return this.http.put<UnitOfMeasurement>(request_url, unit_of_measurement);
  }
}
