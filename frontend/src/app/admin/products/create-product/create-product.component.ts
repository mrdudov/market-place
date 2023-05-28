import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  form: UntypedFormGroup;

  categories: Category[] = [];
  manufacturers: Manufacturer[] = [];
  units_of_measurement: UnitOfMeasurement[] = [];

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private manufacturersService: ManufacturersService,
    private unitsOfMeasurementService: UnitsOfMeasurementService,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
      price: new UntypedFormControl(null, [Validators.required]),
      manufacturer_price: new UntypedFormControl(null, [Validators.required]),
      category: new UntypedFormControl(null, [Validators.required]),
      unit_of_measurement: new UntypedFormControl(null, [Validators.required]),
      manufacturer: new UntypedFormControl(null, [Validators.required]),
      shipping_cost_coefficient: new UntypedFormControl(null, [
        Validators.required,
      ]),
    });
  }

  ngOnInit(): void {
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

    const product: Product = {
      name: this.form.value.name,
      description: this.form.value.description,
      price: this.form.value.price,
      manufacturer_price: this.form.value.manufacturer_price,
      shipping_cost_coefficient: this.form.value.shipping_cost_coefficient,
      category_id: this.form.value.category,
      manufacturer_id: this.form.value.manufacturer,
      unit_of_measurement_id: this.form.value.unit_of_measurement,
    };
    this.productsService.create(product).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'products']);
    });
  }
}
