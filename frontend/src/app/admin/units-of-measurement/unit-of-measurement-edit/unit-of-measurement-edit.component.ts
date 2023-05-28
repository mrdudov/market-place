import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UnitOfMeasurement } from 'src/app/shared/interfaces';
import { UnitsOfMeasurementService } from 'src/app/shared/units-of-measurement.service';

@Component({
  selector: 'app-unit-of-measurement-edit',
  templateUrl: './unit-of-measurement-edit.component.html',
  styleUrls: ['./unit-of-measurement-edit.component.scss'],
})
export class UnitOfMeasurementEditComponent implements OnInit {
  form: UntypedFormGroup;

  unit_of_measurement: UnitOfMeasurement | undefined;
  unit_of_measurement_id: number;

  constructor(
    private route: ActivatedRoute,
    private unitsOfMeasurementService: UnitsOfMeasurementService,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      unit: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.unit_of_measurement_id = parseInt(url.pop()!.toString());
      this.unitsOfMeasurementService
        .getById(this.unit_of_measurement_id)
        .subscribe((unit_of_measurement) => {
          this.unit_of_measurement = unit_of_measurement;
          this.form.get('unit')?.setValue(unit_of_measurement.unit);
          this.form
            .get('description')
            ?.setValue(unit_of_measurement.description);
        });
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.unit_of_measurement!.unit = this.form.get('unit')?.value;
    this.unit_of_measurement!.description = this.form.get('description')?.value;

    this.unitsOfMeasurementService
      .update(this.unit_of_measurement!)
      .subscribe(() => {
        this.form.reset();
        this.router.navigate(['/admin', 'units-of-measurement']);
      });
  }
}
