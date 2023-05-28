import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServices } from 'src/app/admin/shared/services/auth.service';
import { UserProfile } from 'src/app/admin/users/user.interface';
import { ShoppingCartService } from 'src/app/main/shopping-cart.service';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-top-panel',
  templateUrl: './top-panel.component.html',
  styleUrls: ['./top-panel.component.scss'],
})
export class TopPanelComponent implements OnInit {
  user_profile: UserProfile = {
    id: 0,
    email: '',
    user_role: '',
    address: '',
    created_at: new Date(Date.now()),
  };

  constructor(
    public auth: AuthServices,
    private router: Router,
    public usersService: UsersService,
    public shoppingCartService: ShoppingCartService
  ) {}

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.usersService.get_profile().subscribe((profile) => {
        this.user_profile = profile;
      });
    }
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
