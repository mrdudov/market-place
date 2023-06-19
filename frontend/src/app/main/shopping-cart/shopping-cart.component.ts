import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { GetAddressComponent } from 'src/app/shared/components/get-address/get-address.component';
import { SelectProductsComponent } from 'src/app/shared/components/select-products/select-products.component';
import {
  Order,
  OrderProduct,
  OrderStatus,
  Product,
  ProductWithCount,
} from 'src/app/shared/interfaces';
import { OrdersService } from 'src/app/shared/orders.service';
import { ProductsService } from 'src/app/shared/products.service';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  order: Order = {
    order_status: OrderStatus.CREATED,
    products: [],
    price: 0,
    distance: 0,
  };

  products_with_count: ProductWithCount[] = [];
  product: Product | undefined;

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'count',
    'actions',
  ];
  dataSource!: MatTableDataSource<ProductWithCount>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  selected_product: ProductWithCount | undefined;

  constructor(
    public shoppingCartService: ShoppingCartService,
    private router: Router,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.set_display_products();
  }

  add_product() {
    const dialogRef = this.dialog.open(SelectProductsComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.productsService.getById(result.product_id).subscribe((product) => {
        this.product = product;
        let product_wc: ProductWithCount = {
          ...this.product,
          product_count: result.product_count,
        };
        this.shoppingCartService.addProduct(product_wc);
        this.set_display_products();
      });
    });
  }

  save_order() {
    let order_product: OrderProduct[] = [];

    this.products_with_count.forEach((product) => {
      order_product.push({
        product_id: product.id!,
        product_count: product.product_count,
      });
    });

    this.order.products = order_product;

    this.ordersService.create(this.order).subscribe(() => {
      this.shoppingCartService.deleteAllProducts();
      this.set_display_products();
      this.router.navigate(['/orders']);
    });
  }

  edit_product(in_product_count: any) {
    if (in_product_count.value < 1) {
      this.selected_product = undefined;
      return;
    }
    this.shoppingCartService.changeCount(
      this.selected_product!.id!,
      in_product_count.value
    );
    this.selected_product = undefined;
    this.set_display_products();
  }

  private set_display_products(): void {
    this.products_with_count = this.shoppingCartService.getAllProducts();
    this.dataSource = new MatTableDataSource(this.products_with_count);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  delete_product(product_id: number) {
    this.shoppingCartService.deleteProduct(product_id);
    this.set_display_products();
  }

  get_distance() {
    const distanceDialogRef = this.dialog.open(GetAddressComponent);
  }

  select_product(product: ProductWithCount): void {
    this.selected_product = product;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
