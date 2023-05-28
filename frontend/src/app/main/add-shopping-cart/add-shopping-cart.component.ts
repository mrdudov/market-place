import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from 'src/app/shared/interfaces';
import { ProductsService } from 'src/app/shared/products.service';

export interface DialogData {
  product_id: number;
}

@Component({
  selector: 'app-add-shopping-cart',
  templateUrl: './add-shopping-cart.component.html',
  styleUrls: ['./add-shopping-cart.component.scss'],
})
export class AddShoppingCartComponent implements OnInit {
  product: Product;

  count: number = 1;

  constructor(
    public dialogRef: MatDialogRef<AddShoppingCartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productsService.getById(this.data.product_id).subscribe((product) => {
      this.product = product;
    });
  }

  onAdd() {
    this.dialogRef.close(this.count);
  }

  onCancle() {
    this.dialogRef.close();
  }
}
