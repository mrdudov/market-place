import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Manufacturer } from '../../interfaces';
import { ManufacturersService } from '../../manufacturers.service';

@Component({
  selector: 'app-manufacturer-selector',
  templateUrl: './manufacturer-selector.component.html',
  styleUrls: ['./manufacturer-selector.component.scss'],
})
export class ManufacturerSelectorComponent implements OnInit {
  @Output() changeManufacturer = new EventEmitter();

  manufacturers: Manufacturer[] = [];
  selected_manufacturer_id: number = 0;

  constructor(private manufacturersService: ManufacturersService) {
    this.manufacturersService.getAll().subscribe((manufacturers) => {
      this.manufacturers = manufacturers;
    });
  }

  ngOnInit(): void {}
}
