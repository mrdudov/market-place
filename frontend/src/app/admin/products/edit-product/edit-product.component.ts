import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/shared/categories.service';
import {
  Category,
  Manufacturer,
  Product,
  UnitOfMeasurement,
} from 'src/app/shared/interfaces';
import { ManufacturersService } from 'src/app/shared/manufacturers.service';
import { ProductsService } from 'src/app/shared/products.service';
import { UnitsOfMeasurementService } from 'src/app/shared/units-of-measurement.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss'],
})
export class EditProductComponent implements OnInit {
  form: UntypedFormGroup;

  categories: Category[] = [];
  manufacturers: Manufacturer[] = [];
  units_of_measurement: UnitOfMeasurement[] = [];

  product: Product | undefined;
  product_id: string = '';

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private manufacturersService: ManufacturersService,
    private productsService: ProductsService,
    private unitsOfMeasurementService: UnitsOfMeasurementService,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
      price: new UntypedFormControl(null, [Validators.required]),
      manufacturer_price: new UntypedFormControl(null, [Validators.required]),
      category: new UntypedFormControl(null, [Validators.required]),
      manufacturer: new UntypedFormControl(null, [Validators.required]),
      unit_of_measurement: new UntypedFormControl(null, [Validators.required]),
      shipping_cost_coefficient: new UntypedFormControl(null, [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.product_id = url.pop()!.toString();
      this.productsService
        .getById(parseInt(this.product_id))
        .subscribe((product) => {
          this.product = product;
          this.form.get('name')?.setValue(product.name);
          this.form.get('description')?.setValue(product.description);
          this.form.get('price')?.setValue(product.price);
          this.form.get('category')?.setValue(product.category_id);
          this.form
            .get('manufacturer_price')
            ?.setValue(product.manufacturer_price);
          this.form.get('manufacturer')?.setValue(product.manufacturer_id);
          this.form
            .get('shipping_cost_coefficient')
            ?.setValue(product.shipping_cost_coefficient);
          this.form
            .get('unit_of_measurement')
            ?.setValue(product.unit_of_measurement_id);
        });
    });

    this.categoriesService.getAll().subscribe((categories) => {
      this.categories = categories;
    });
    this.manufacturersService.getAll().subscribe((manufacturers) => {
      this.manufacturers = manufacturers;
    });
    this.unitsOfMeasurementService
      .getAll()
      .subscribe((units_of_measurement) => {
        this.units_of_measurement = units_of_measurement;
      });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.product!.name = this.form.get('name')?.value;
    this.product!.description = this.form.get('description')?.value;
    this.product!.category_id = this.form.get('category')?.value;
    this.product!.price = this.form.get('price')?.value;
    this.product!.manufacturer_id = this.form.get('manufacturer')?.value;
    this.product!.manufacturer_price =
      this.form.get('manufacturer_price')?.value;
    this.product!.shipping_cost_coefficient = this.form.get(
      'shipping_cost_coefficient'
    )?.value;
    this.product!.unit_of_measurement_id = this.form.get(
      'unit_of_measurement'
    )?.value;

    this.productsService.update(this.product!).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'products']);
    });
  }
}
