import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './main/orders/order/order.component';
import { OrdersComponent } from './main/orders/orders/orders.component';
import { ProductsComponent } from './main/products/products.component';
import { MainLayoutComponent } from './main/layout/main-layout/main-layout.component';
import { UserProfileComponent } from './shared/users/user-profile/user-profile.component';
import { RegisterPageComponent } from './shared/users/register-page/register-page.component';
import { AdminRegisterComponent } from './shared/users/admin-register/admin-register.component';
import { LegalEntityRegisterComponent } from './shared/users/legal-entity-register/legal-entity-register.component';
import { IndividualRegisterComponent } from './shared/users/individual-register/individual-register.component';
import { UserComponent } from './shared/users/user/user.component';
import { LoginPageComponent } from './shared/users/login-page/login-page.component';
import { ShoppingCartComponent } from './main/shopping-cart/shopping-cart.component';

const user_routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'profile', component: UserProfileComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'register-as-admin', component: AdminRegisterComponent },
  { path: 'register-as-legal-entity', component: LegalEntityRegisterComponent },
  { path: 'register-as-individual', component: IndividualRegisterComponent },
];

const main_routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: ProductsComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'order/:id', component: OrderComponent },
];

const routes: Routes = [
  { path: '', component: MainLayoutComponent, children: main_routes },
  { path: 'users', component: UserComponent, children: user_routes },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
