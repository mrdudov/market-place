import { Component, OnInit } from '@angular/core';
import { AuthServices } from 'src/app/admin/shared/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  constructor(public auth: AuthServices) {}

  ngOnInit(): void {}
}
