import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { LoginPageComponent } from '../shared/users/login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './shared/services/auth.guard';
import { AlertComponent } from './shared/components/alert/alert.component';
import { AlertService } from './shared/services/alert.service';
import { AdminMainPageComponent } from './layout/admin-main-page/admin-main-page.component';
import { AdminPageSideNavbarComponent } from './layout/admin-page-side-navbar/admin-page-side-navbar.component';
import { MaterialModule } from '../material/material.module';
import { CategoriesComponent } from './categories/categories/categories.component';
import { CategoryCreateComponent } from './categories/category-create/category-create.component';
import { CategoryEditorComponent } from './categories/category-editor/category-editor.component';
import { ProductsComponent } from './products/products/products.component';
import { OrdersComponent } from './orders/orders/orders.component';
import { CreateProductComponent } from './products/create-product/create-product.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { EditOrderComponent } from './orders/edit-order/edit-order.component';
import { ManufacturersComponent } from './manufacturers/manufacturers/manufacturers.component';
import { CreateManufacturerComponent } from './manufacturers/create-manufacturer/create-manufacturer.component';
import { EditManufacturerComponent } from './manufacturers/edit-manufacturer/edit-manufacturer.component';
import { SharedModule } from '../shared/shared.module';
import { UnitsOfMeasurementComponent } from './units-of-measurement/units-of-measurement/units-of-measurement.component';
import { UnitOfMeasurementCreateComponent } from './units-of-measurement/unit-of-measurement-create/unit-of-measurement-create.component';
import { UnitOfMeasurementEditComponent } from './units-of-measurement/unit-of-measurement-edit/unit-of-measurement-edit.component';
import { UsersComponent } from './users/users/users.component';
import { EditUserComponent } from './users/edit-user/edit-user.component';
import { CreateUserComponent } from './users/create-user/create-user.component';

const path = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminMainPageComponent, canActivate: [AuthGuard] },

      { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
      {
        path: 'edit-user/:id',
        component: EditUserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'create-user',
        component: CreateUserComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'categories',
        component: CategoriesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'create-category',
        component: CategoryCreateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'edit-category/:id',
        component: CategoryEditorComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'manufacturers',
        component: ManufacturersComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'create-manufacturer',
        component: CreateManufacturerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'edit-manufacturer/:id',
        component: EditManufacturerComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'units-of-measurement',
        component: UnitsOfMeasurementComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'create-unit-of-measurement',
        component: UnitOfMeasurementCreateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'edit-unit-of-measurement/:id',
        component: UnitOfMeasurementEditComponent,
        canActivate: [AuthGuard],
      },

      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'create-product',
        component: CreateProductComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'edit-product/:id',
        component: EditProductComponent,
        canActivate: [AuthGuard],
      },

      { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
      {
        path: 'create-order',
        component: CreateOrderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'edit-order/:id',
        component: EditOrderComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    AdminLayoutComponent,
    LoginPageComponent,
    AlertComponent,
    AdminMainPageComponent,
    AdminPageSideNavbarComponent,
    CategoriesComponent,
    ProductsComponent,
    OrdersComponent,
    CreateProductComponent,
    EditProductComponent,
    CreateOrderComponent,
    EditOrderComponent,
    ManufacturersComponent,
    CreateManufacturerComponent,
    EditManufacturerComponent,
    UnitsOfMeasurementComponent,
    UnitOfMeasurementCreateComponent,
    UnitOfMeasurementEditComponent,
    UsersComponent,
    EditUserComponent,
    CreateUserComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(path),
    MaterialModule,
  ],
  exports: [RouterModule],
  providers: [AuthGuard, AlertService],
})
export class AdminModule {}
