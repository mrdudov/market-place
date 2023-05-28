import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Manufacturer } from 'src/app/shared/interfaces';
import { ManufacturersService } from 'src/app/shared/manufacturers.service';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.scss'],
})
export class ManufacturersComponent implements OnInit {
  manufacturers: Manufacturer[] = [];

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'address',
    'edit',
    'delete',
  ];
  dataSource!: MatTableDataSource<Manufacturer>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private manufacturersService: ManufacturersService) {}

  ngOnInit(): void {
    this.manufacturersService.getAll().subscribe((manufacturers) => {
      this.manufacturers = manufacturers;
      this.dataSource = new MatTableDataSource(this.manufacturers);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  delete_manufacturer(manufacturer_id: number) {
    this.manufacturersService.remove(manufacturer_id).subscribe(() => {
      this.manufacturers = this.manufacturers.filter(
        (manufacturer) => manufacturer.id !== manufacturer_id
      );
      this.dataSource = new MatTableDataSource(this.manufacturers);
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
