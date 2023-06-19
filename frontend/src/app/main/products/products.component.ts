import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { CategoriesService } from '../../shared/categories.service';
import {
  Category,
  Manufacturer,
  Product,
  ProductWithCount,
} from '../../shared/interfaces';
import { ManufacturersService } from '../../shared/manufacturers.service';
import { ProductsService } from '../../shared/products.service';
import { AddShoppingCartComponent } from '../add-shopping-cart/add-shopping-cart.component';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  categories: Category[] = [];
  manufacturers: Manufacturer[] = [];
  selected_category_id: number = 0;
  selected_manufacturer_id: number = 0;
  product_with_count_to_cart: ProductWithCount;

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'manufacturer_price',
    'shipping_cost_coefficient',
    'add_to_cart',
  ];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private set_display_products(category_id: number, manufacturer_id: number) {
    this.productsService
      .getAll(category_id, manufacturer_id, 0, 200)
      .subscribe((products) => {
        this.dataSource = new MatTableDataSource(products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  constructor(
    public dialog: MatDialog,
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private manufacturersService: ManufacturersService,
    private shoppingCart: ShoppingCartService
  ) {
    this.set_display_products(
      this.selected_category_id,
      this.selected_manufacturer_id
    );
    this.categoriesService.getAll().subscribe((categories) => {
      this.categories = categories;
    });
    this.manufacturersService.getAll().subscribe((manufacturers) => {
      this.manufacturers = manufacturers;
    });
  }

  ngOnInit(): void {}

  add_shopping_cart(product_id: number) {
    const dialogRef = this.dialog.open(AddShoppingCartComponent, {
      data: { product_id: product_id },
    });
    this.productsService.getById(product_id).subscribe((product) => {
      this.product_with_count_to_cart = {
        ...product,
        product_count: 0,
      };
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.product_with_count_to_cart.product_count = result;
        this.shoppingCart.addProduct(this.product_with_count_to_cart);
      }
    });
  }

  change_category(event: number) {
    this.selected_category_id = event;
    this.set_display_products(
      this.selected_category_id,
      this.selected_manufacturer_id
    );
  }

  change_manufacturer(event: number) {
    this.selected_manufacturer_id = event;
    this.set_display_products(
      this.selected_category_id,
      this.selected_manufacturer_id
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
