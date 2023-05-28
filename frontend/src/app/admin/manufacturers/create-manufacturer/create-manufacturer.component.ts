import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Manufacturer } from 'src/app/shared/interfaces';
import { ManufacturersService } from 'src/app/shared/manufacturers.service';

@Component({
  selector: 'app-create-manufacturer',
  templateUrl: './create-manufacturer.component.html',
  styleUrls: ['./create-manufacturer.component.scss'],
})
export class CreateManufacturerComponent implements OnInit {
  form: UntypedFormGroup;

  constructor(
    private manufacturersService: ManufacturersService,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
      address: new UntypedFormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.invalid) {
      return;
    }

    const manufacturer: Manufacturer = {
      name: this.form.value.name,
      description: this.form.value.description,
      address: this.form.value.address,
    };
    this.manufacturersService.create(manufacturer).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'manufacturers']);
    });
  }
}
