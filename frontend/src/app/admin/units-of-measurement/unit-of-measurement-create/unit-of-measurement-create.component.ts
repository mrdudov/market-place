import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UnitOfMeasurement } from 'src/app/shared/interfaces';
import { UnitsOfMeasurementService } from 'src/app/shared/units-of-measurement.service';

@Component({
  selector: 'app-unit-of-measurement-create',
  templateUrl: './unit-of-measurement-create.component.html',
  styleUrls: ['./unit-of-measurement-create.component.scss'],
})
export class UnitOfMeasurementCreateComponent implements OnInit {
  form: UntypedFormGroup;

  constructor(
    private unitsOfMeasurementService: UnitsOfMeasurementService,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      unit: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.invalid) {
      return;
    }

    const unit_of_measurement: UnitOfMeasurement = {
      unit: this.form.value.unit,
      description: this.form.value.description,
    };
    this.unitsOfMeasurementService.create(unit_of_measurement).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'units-of-measurement']);
    });
  }
}
