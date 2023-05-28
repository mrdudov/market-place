import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Manufacturer } from 'src/app/shared/interfaces';
import { ManufacturersService } from 'src/app/shared/manufacturers.service';

@Component({
  selector: 'app-edit-manufacturer',
  templateUrl: './edit-manufacturer.component.html',
  styleUrls: ['./edit-manufacturer.component.scss'],
})
export class EditManufacturerComponent implements OnInit {
  form: UntypedFormGroup;

  manufacturer: Manufacturer | undefined;
  manufacturer_id: string = '';

  constructor(
    private route: ActivatedRoute,
    private manufacturersService: ManufacturersService,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
      address: new UntypedFormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.manufacturer_id = url.pop()!.toString();
      this.manufacturersService
        .getById(this.manufacturer_id)
        .subscribe((manufacturer) => {
          this.manufacturer = manufacturer;
          this.form.get('name')?.setValue(manufacturer.name);
          this.form.get('description')?.setValue(manufacturer.description);
          this.form.get('address')?.setValue(manufacturer.address);
        });
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.manufacturer!.name = this.form.get('name')?.value;
    this.manufacturer!.description = this.form.get('description')?.value;
    this.manufacturer!.address = this.form.get('address')?.value;

    this.manufacturersService.update(this.manufacturer!).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'manufacturers']);
    });
  }
}
