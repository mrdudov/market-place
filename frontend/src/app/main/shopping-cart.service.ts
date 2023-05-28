import { Injectable } from '@angular/core';
import { ProductWithCount } from '../shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  products: ProductWithCount[] = [];

  constructor() {
    const shopping_cart = localStorage.getItem('shopping-cart');
    if (shopping_cart) {
      this.products = JSON.parse(shopping_cart);
    }
  }

  getAllProducts(): ProductWithCount[] {
    return this.products;
  }

  addProduct(product: ProductWithCount): ProductWithCount[] {
    let is_product_in_cart: Boolean = false;

    this.products.forEach((product_item) => {
      if (product_item.id === product.id) {
        is_product_in_cart = true;
      }
    });

    if (is_product_in_cart) {
      this.products.forEach((product_item) => {
        if (product_item.id === product.id) {
          product_item.product_count += Number(product.product_count);
        }
      });
    } else {
      this.products.push(product);
    }

    this.save_cart_to_local_storage();
    return this.products;
  }

  deleteAllProducts(): void {
    this.products = [];
    this.save_cart_to_local_storage();
  }

  deleteProduct(product_id: number): ProductWithCount[] {
    this.products = this.products.filter(
      (product) => product.id !== product_id
    );
    this.save_cart_to_local_storage();
    return this.products;
  }

  getProductsCount(): number {
    return this.products.length;
  }

  changeCount(product_id: number, count: number): ProductWithCount[] {
    this.products.forEach((el) => {
      if (el.id === product_id) {
        el.product_count = count;
      }
    });
    this.save_cart_to_local_storage();
    return this.products;
  }

  private save_cart_to_local_storage() {
    const products_json = JSON.stringify(this.products);
    localStorage.setItem('shopping-cart', products_json);
  }
}
