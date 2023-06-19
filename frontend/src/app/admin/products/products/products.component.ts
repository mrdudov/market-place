import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { CategoriesService } from 'src/app/shared/categories.service';
import { Category, Manufacturer, Product } from 'src/app/shared/interfaces';
import { ManufacturersService } from 'src/app/shared/manufacturers.service';
import { ProductsService } from 'src/app/shared/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];

  categories: Category[] = [];
  manufacturers: Manufacturer[] = [];
  selected_category_id: number = 0;
  selected_manufacturer_id: number = 0;

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'manufacturer_price',
    'shipping_cost_coefficient',
    'edit',
    'delete',
  ];
  dataSource!: MatTableDataSource<Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private manufacturersService: ManufacturersService
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

  ngOnInit(): void {
    this.productsService.getAll().subscribe((products) => {
      this.products = products;
      this.dataSource = new MatTableDataSource(this.products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private set_display_products(category_id: number, manufacturer_id: number) {
    this.productsService
      .getAll(category_id, manufacturer_id, 0, 200)
      .subscribe((products) => {
        this.products = products;
        this.dataSource = new MatTableDataSource(products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  delete_product(product_id: number) {
    this.productsService.remove(product_id).subscribe(() => {
      this.products = this.products.filter(
        (product) => product.id !== product_id
      );
      this.dataSource = new MatTableDataSource(this.products);
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
