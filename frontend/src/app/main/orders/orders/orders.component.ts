import { Component, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Router } from '@angular/router';
import { Order, OrderStatus } from '../../../shared/interfaces';
import { OrdersService } from '../../../shared/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  getOrderStatus(state: OrderStatus) {
    switch (state) {
      case OrderStatus.ACCEPTED:
        return 'Принят';
      case OrderStatus.CREATED:
        return 'Создан';
      case OrderStatus.FINISHED:
        return 'Завершен';
      case OrderStatus.PROCESSING:
        return 'В обработке';
      case OrderStatus.REJECTED:
        return 'Отменен';
      default:
        return 'unknown';
    }
  }

  orders: Order[] | undefined;

  displayedColumns: string[] = ['id', 'order_status', 'products', 'edit'];
  dataSource!: MatTableDataSource<Order>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private ordersService: OrdersService, private router: Router) {
    this.ordersService.getAll().subscribe((orders) => {
      this.orders = orders;
      this.dataSource = new MatTableDataSource(this.orders);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit(): void {}

  edit_order(id: number) {
    this.router.navigate(['/order', id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
