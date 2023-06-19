import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { SelectProductsComponent } from 'src/app/shared/components/select-products/select-products.component';
import {
  EditOrder,
  Order,
  OrderStatus,
  Product,
  ProductWithCount,
} from 'src/app/shared/interfaces';
import { getOrderStatus, OrdersService } from 'src/app/shared/orders.service';
import { ProductsService } from 'src/app/shared/products.service';

@Component({
  selector: 'app-edit-order',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.scss'],
})
export class EditOrderComponent implements OnInit {
  get_order_status = getOrderStatus;

  form: UntypedFormGroup;
  orderStatus = OrderStatus;
  orderStatusKeys: string[] = [];
  order_id: string = '';
  order: Order | undefined;
  products: Product[] = [];
  products_with_count: ProductWithCount[] = [];
  order_product_id: number[] = [];
  selected_product: ProductWithCount | undefined;
  edit_order: EditOrder;

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

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    public dialog: MatDialog
  ) {
    this.orderStatusKeys = Object.keys(this.orderStatus);
    this.form = new UntypedFormGroup({
      distance: new UntypedFormControl(null, [Validators.required]),
      price: new UntypedFormControl(null, [Validators.required]),
      order_status: new UntypedFormControl(null, [Validators.required]),
    });
  }

  private get_product_count_by_id(id: number): number {
    for (let item of this.order!.products!) {
      if (item.product_id === id) {
        return item.product_count;
      }
    }
    return 0;
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

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.order_id = url.pop()!.toString();
      this.ordersService.getById(parseInt(this.order_id)).subscribe((order) => {
        this.form.get('price')?.setValue(order.price);
        this.form.get('distance')?.setValue(order.distance);
        this.form.get('order_status')?.setValue(order.order_status);
        this.set_display_order(order);
      });
    });
  }

  form_change() {
    this.submit();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.edit_order = {
      order_status: this.form.get('order_status')?.value,
      price: this.form.get('price')?.value,
      distance: this.form.get('distance')?.value,
    };
    this.ordersService
      .update_order(this.order?.id!, this.edit_order)
      .subscribe((order) => {
        this.set_display_order(order);
      });
  }

  add_product() {
    const dialogRef = this.dialog.open(SelectProductsComponent);
    dialogRef.afterClosed().subscribe((result) => {
      this.ordersService
        .add_products(parseInt(this.order_id), [result])
        .subscribe((order) => {
          this.set_display_order(order);
        });
    });
  }

  get_distance() {
    // const distanceDialogRef = this.dialog.open(GetAddressComponent);
  }

  delete_product(id: number) {
    this.ordersService
      .remove_products(parseInt(this.order_id), [id])
      .subscribe((order) => {
        this.set_display_order(order);
      });
  }

  select_product(product: ProductWithCount): void {
    this.selected_product = product;
  }

  edit_product(in_product_count: any) {
    if (in_product_count.value < 1) {
      this.selected_product = undefined;
      return;
    }
    this.ordersService
      .edit_products(parseInt(this.order_id), [
        {
          product_id: this.selected_product?.id!,
          product_count: in_product_count.value,
        },
      ])
      .subscribe((order) => {
        this.set_display_order(order);
        this.selected_product = undefined;
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
