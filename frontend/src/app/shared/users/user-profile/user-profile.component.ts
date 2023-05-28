import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { UserProfile } from 'src/app/admin/users/user.interface';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  form: UntypedFormGroup;

  user_profile: UserProfile = {
    id: 0,
    email: '',
    user_role: '',
    address: '',
    created_at: new Date(Date.now()),
  };

  constructor(public usersService: UsersService) {
    this.form = new UntypedFormGroup({
      address: new UntypedFormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.usersService.get_profile().subscribe((profile) => {
      this.form.get('address')?.setValue(profile.address);
      this.user_profile = profile;
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.user_profile!.address = this.form.get('address')?.value;

    this.usersService.set_profile(this.user_profile!).subscribe((profile) => {
      this.user_profile = profile;
    });
  }
}
