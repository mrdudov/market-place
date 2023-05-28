import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { User } from '../../users/user.interface';

const login_url = `http://localhost:8004/login`;

@Injectable({
  providedIn: 'root',
})
export class AuthServices {
  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem('jwt-token')!;
  }

  login(user: User): Observable<any> {
    return this.http
      .post(login_url, user)
      .pipe(tap(this.setToken), catchError(this.handleError.bind(this)));
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return Boolean(this.token);
  }

  private handleError(error: HttpErrorResponse) {
    const { message } = error.error.error;
    switch (message) {
      case 'EMAIL_NOT_FOUND':
        this.error$.next('EMAIL_NOT_FOUND');
        break;
      case 'INVALID_EMAIL':
        this.error$.next('INVALID_EMAIL');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('INVALID_PASSWORD');
        break;
    }
    return throwError(() => new Error(message));
  }

  private setToken(response: any) {
    if (response) {
      localStorage.setItem('jwt-token', response.access_token);
    } else {
      localStorage.clear();
    }
  }
}
