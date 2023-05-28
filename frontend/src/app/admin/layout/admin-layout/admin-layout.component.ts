import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/shared/users.service';
import { AuthServices } from '../../shared/services/auth.service';
import { UserProfile } from '../../users/user.interface';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  user_profile: UserProfile = {
    id: 0,
    email: '',
    user_role: '',
    address: '',
    created_at: new Date(Date.now()),
  };

  constructor(
    private router: Router,
    public auth: AuthServices,
    public usersService: UsersService
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.usersService.get_profile().subscribe((profile) => {
        this.user_profile = profile;
      });
    }
  }

  is_login_page() {
    return true;
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/users', 'login']);
  }

  login(event: Event) {
    event.preventDefault();
    this.router.navigate(['/users', 'login']);
  }
}
