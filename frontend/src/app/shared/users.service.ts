import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  CreateUserAdmin,
  CreateUserIndividual,
  CreateUserLegalEntity,
  UserProfile,
} from '../admin/users/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getAll(offset: number = 0, limit: number = 200): Observable<UserProfile[]> {
    const request_url = `${environment.backendApiUrl}/users/`;
    let params = new HttpParams();
    params = params.append('offset', offset);
    params = params.append('limit', limit);
    return this.http.get<UserProfile[]>(request_url, { params: params });
  }

  getById(id: number): Observable<UserProfile> {
    const request_url = `${environment.backendApiUrl}/users/${id}/`;
    return this.http.get<UserProfile>(request_url);
  }

  create_admin_user(user: CreateUserAdmin): Observable<UserProfile> {
    const request_url = `${environment.backendApiUrl}/users/create-admin/`;
    return this.http.post<UserProfile>(request_url, user);
  }

  create_legal_entity_user(
    user: CreateUserLegalEntity
  ): Observable<UserProfile> {
    const request_url = `${environment.backendApiUrl}/users/create-legal-entity/`;
    return this.http.post<UserProfile>(request_url, user);
  }

  create_individual_user(user: CreateUserIndividual): Observable<UserProfile> {
    const request_url = `${environment.backendApiUrl}/users/create-individual/`;
    return this.http.post<UserProfile>(request_url, user);
  }

  get_profile(): Observable<UserProfile> {
    const request_url = `${environment.backendApiUrl}/users/profile`;
    return this.http.get<UserProfile>(request_url).pipe(
      map((i) => {
        return {
          ...i,
          created_at: new Date(i.created_at),
        };
      })
    );
  }

  set_profile(user_profile: UserProfile): Observable<UserProfile> {
    const request_url = `${environment.backendApiUrl}/users/profile`;
    return this.http.post<UserProfile>(request_url, user_profile).pipe(
      map((i) => {
        return {
          ...i,
          created_at: new Date(i.created_at),
        };
      })
    );
  }
}
