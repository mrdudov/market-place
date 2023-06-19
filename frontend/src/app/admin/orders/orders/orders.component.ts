import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { Order } from 'src/app/shared/interfaces';
import { getOrderStatus, OrdersService } from 'src/app/shared/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  get_order_status = getOrderStatus;

  orders: Order[] = [];

  displayedColumns: string[] = [
    'id',
    'order_status',
    'price',
    'distance',
    'products',
    'edit',
    'delete',
  ];
  dataSource!: MatTableDataSource<Order>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private ordersService: OrdersService, private router: Router) {}

  ngOnInit(): void {
    this.ordersService.getAll().subscribe((orders) => {
      this.orders = orders;
      this.dataSource = new MatTableDataSource(this.orders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  delete_order(order_id: number) {
    this.ordersService.remove(order_id).subscribe(() => {
      this.orders = this.orders.filter((order) => order.id !== order_id);
      this.dataSource = new MatTableDataSource(this.orders);
    });
  }

  chanage_order(order_id: number) {
    this.router.navigate(['/admin', 'edit-order', order_id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
