import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UnitOfMeasurement } from 'src/app/shared/interfaces';
import { UnitsOfMeasurementService } from 'src/app/shared/units-of-measurement.service';

@Component({
  selector: 'app-units-of-measurement',
  templateUrl: './units-of-measurement.component.html',
  styleUrls: ['./units-of-measurement.component.scss'],
})
export class UnitsOfMeasurementComponent implements OnInit {
  units_of_measurement: UnitOfMeasurement[] = [];

  displayedColumns: string[] = ['id', 'unit', 'description', 'edit', 'delete'];
  dataSource!: MatTableDataSource<UnitOfMeasurement>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private unitsOfMeasurementService: UnitsOfMeasurementService) {}

  ngOnInit(): void {
    this.unitsOfMeasurementService
      .getAll()
      .subscribe((units_of_measurement) => {
        this.units_of_measurement = units_of_measurement;
        this.dataSource = new MatTableDataSource(this.units_of_measurement);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  delete_unit_of_measurement(unit_of_measurement_id: number) {
    this.unitsOfMeasurementService
      .remove(unit_of_measurement_id)
      .subscribe(() => {
        this.units_of_measurement = this.units_of_measurement.filter(
          (unit_of_measurement) =>
            unit_of_measurement.id !== unit_of_measurement_id
        );
        this.dataSource = new MatTableDataSource(this.units_of_measurement);
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
