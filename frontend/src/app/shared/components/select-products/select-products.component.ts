import { Component, OnInit, ViewChild } from '@angular/core';
import { OrderProduct, Product } from 'src/app/shared/interfaces';
import { ProductsService } from 'src/app/shared/products.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-select-products',
  templateUrl: './select-products.component.html',
  styleUrls: ['./select-products.component.scss'],
})
export class SelectProductsComponent implements OnInit {
  category_id: number = 0;

  displayedColumns: string[] = [
    'name',
    'description',
    'price',
    'manufacturer_price',
    'shipping_cost_coefficient',
  ];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  products: Product[] | undefined;
  selected_product: Product | undefined;
  selected_manufacturer_id: number = 0;

  order_product: OrderProduct = {
    product_count: 0,
    product_id: 0,
  };

  constructor(
    private productsService: ProductsService,
    public dialogRef: MatDialogRef<SelectProductsComponent>
  ) {}

  ngOnInit(): void {
    this.products_view_set(this.category_id, this.selected_manufacturer_id);
  }

  private products_view_set(category_id: number, manufacturer_id: number) {
    this.productsService
      .getAll(category_id, manufacturer_id, 0, 200)
      .subscribe((products) => {
        this.products = products;
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
  changeCateyory(category_id: any) {
    this.category_id = category_id;
    this.products_view_set(this.category_id, this.selected_manufacturer_id);
  }

  changeManufacturer(manufacturer_id: any) {
    this.selected_manufacturer_id = manufacturer_id;
    this.products_view_set(this.category_id, this.selected_manufacturer_id);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  row_click(in_data: any) {
    this.selected_product = in_data;
    if (this.selected_product && this.selected_product.id) {
      this.order_product.product_id = this.selected_product.id;
    }
    this.order_product.product_count = 1;
  }

  onClose(el: any) {
    this.order_product.product_count = el.value;
    if (
      this.order_product.product_count !== 0 &&
      this.order_product.product_id !== 0
    ) {
      this.dialogRef.close(this.order_product);
    } else {
      this.dialogRef.close();
    }
  }

  onCancle() {
    this.dialogRef.close();
  }
}
