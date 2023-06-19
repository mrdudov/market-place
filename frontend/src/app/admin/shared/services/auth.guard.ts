import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServices } from './auth.service';

@Injectable()
export class AuthGuard  {
  constructor(private auth: AuthServices, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (this.auth.isAuthenticated()) {
      return true;
    } else {
      this.auth.logout();
      this.router.navigate(['/users', 'login'], {
        queryParams: {
          loginAgain: true,
        },
      });
      return false;
    }
  }
}
