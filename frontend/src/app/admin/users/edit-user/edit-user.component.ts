import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/shared/users.service';
import { UserProfile } from '../user.interface';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  form: UntypedFormGroup;

  user: UserProfile | undefined;
  user_id: string = '';

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      address: new UntypedFormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      this.user_id = url.pop()!.toString();
      this.usersService.getById(parseInt(this.user_id)).subscribe((user) => {
        this.user = user;
        this.form.get('address')?.setValue(user.address);
      });
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.user!.address = this.form.get('address')?.value;

    this.usersService.set_profile(this.user!).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'users']);
    });
  }
}
