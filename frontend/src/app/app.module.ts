import { LOCALE_ID, NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './main/layout/main-layout/main-layout.component';
import { HomePageComponent } from './main/layout/home-page/home-page.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/auth.interceptor';
import { registerLocaleData } from '@angular/common';
import ruLocale from '@angular/common/locales/ru';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { CategoryEditorComponent } from './admin/categories/category-editor/category-editor.component';
import { CategoryCreateComponent } from './admin/categories/category-create/category-create.component';
import { ProductsComponent } from './main/products/products.component';
import { OrdersComponent } from './main/orders/orders/orders.component';
import { MaterialModule } from './material/material.module';
import { OrderComponent } from './main/orders/order/order.component';
import { SelectProductsComponent } from './shared/components/select-products/select-products.component';
import { UserProfileComponent } from './shared/users/user-profile/user-profile.component';
import { AdminRegisterComponent } from './shared/users/admin-register/admin-register.component';
import { LegalEntityRegisterComponent } from './shared/users/legal-entity-register/legal-entity-register.component';
import { IndividualRegisterComponent } from './shared/users/individual-register/individual-register.component';
import { RegisterPageComponent } from './shared/users/register-page/register-page.component';
import { SharedModule } from './shared/shared.module';
import { ShoppingCartComponent } from './main/shopping-cart/shopping-cart.component';
import { AddShoppingCartComponent } from './main/add-shopping-cart/add-shopping-cart.component';

registerLocaleData(ruLocale, 'ru');

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor,
};

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomePageComponent,
    CategoryEditorComponent,
    CategoryCreateComponent,
    ProductsComponent,
    OrdersComponent,
    OrderComponent,
    SelectProductsComponent,
    UserProfileComponent,
    AdminRegisterComponent,
    LegalEntityRegisterComponent,
    IndividualRegisterComponent,
    RegisterPageComponent,
    ShoppingCartComponent,
    AddShoppingCartComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [INTERCEPTOR_PROVIDER, { provide: LOCALE_ID, useValue: 'ru' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
