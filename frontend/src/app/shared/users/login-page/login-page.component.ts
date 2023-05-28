import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from 'src/app/admin/users/user.interface';
import { AuthServices } from '../../../admin/shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  form: UntypedFormGroup;
  submitted = false;
  message: string = '';

  constructor(
    public auth: AuthServices,
    private router: Router,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['loginAgain']) {
        this.message = 'login again';
      } else if (params['authFailed']) {
        this.message = 'auth failed';
      }
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const user: User = {
      username: this.form.value.email,
      password: this.form.value.password,
    };

    this.auth.login(user).subscribe({
      complete: () => {
        this.form.reset();
        this.router.navigate(['/admin']);
        this.submitted = false;
      },
      error: () => {
        this.submitted = false;
      },
    });
  }
}
