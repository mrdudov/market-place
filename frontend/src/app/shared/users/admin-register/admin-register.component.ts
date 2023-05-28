import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServices } from 'src/app/admin/shared/services/auth.service';
import { CreateUserAdmin } from 'src/app/admin/users/user.interface';
import { UsersService } from 'src/app/shared/users.service';

@Component({
  selector: 'app-admin-register',
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.scss'],
})
export class AdminRegisterComponent implements OnInit {
  form: UntypedFormGroup;
  submitted = false;
  message: string = '';

  constructor(
    public auth: AuthServices,
    private usersService: UsersService,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      email: new UntypedFormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new UntypedFormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.invalid) {
      return;
    }

    this.submitted = true;
    const user: CreateUserAdmin = {
      email: this.form.value.email,
      password: this.form.value.password,
    };

    this.usersService.create_admin_user(user).subscribe({
      complete: () => {
        this.form.reset();
        this.router.navigate(['/']);
        this.submitted = false;
      },
      error: () => {
        this.submitted = false;
      },
    });
  }
}
