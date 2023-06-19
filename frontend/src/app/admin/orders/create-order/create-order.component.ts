import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { SelectProductsComponent } from 'src/app/shared/components/select-products/select-products.component';
import {
  Order,
  OrderStatus,
  Product,
  ProductWithCount,
} from 'src/app/shared/interfaces';
import { OrdersService } from 'src/app/shared/orders.service';
import { ProductsService } from 'src/app/shared/products.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
})
export class CreateOrderComponent implements OnInit {
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

  products_with_count: ProductWithCount[] = [];

  order_product_id: number[] = [];
  products: Product[] = [];

  order: Order = {
    order_status: OrderStatus.CREATED,
    products: [],
    price: 0,
    distance: 0,
  };

  constructor(
    private productsService: ProductsService,
    private ordersService: OrdersService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  private get_product_count_by_id(id: number): number {
    for (let item of this.order!.products!) {
      if (item.product_id === id) {
        return item.product_count;
      }
    }
    return 0;
  }

  ngOnInit(): void {}

  add_product() {
    const dialogRef = this.dialog.open(SelectProductsComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }
      this.order.products!.push(result);
      this.set_display_order(this.order);
    });
  }

  private set_display_order(order: Order): void {
    this.order = order;
    this.order_product_id = [];
    this.products_with_count = [];

    if (this.order && this.order.products) {
      for (let item of this.order.products) {
        this.order_product_id.push(item.product_id);
      }
    }

    this.productsService
      .get_by_id_list(this.order_product_id)
      .subscribe((products) => {
        for (let product of products) {
          let tmp: ProductWithCount = {
            ...product,
            product_count: this.get_product_count_by_id(product.id!),
          };
          this.products_with_count.push(tmp);
        }
        this.products = products;
        this.dataSource = new MatTableDataSource(this.products_with_count);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  delete_product(id: number) {
    this.order.products! = this.order.products!.filter(
      (item) => item.product_id !== id
    );
    this.set_display_order(this.order);
  }

  add_order() {
    this.ordersService.create(this.order).subscribe(() => {
      this.router.navigate(['/admin', 'orders']);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
