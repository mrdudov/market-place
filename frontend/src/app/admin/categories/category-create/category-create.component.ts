import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../../shared/categories.service';
import { Category } from '../../../shared/interfaces';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss'],
})
export class CategoryCreateComponent implements OnInit {
  form: UntypedFormGroup;

  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
      is_active: new UntypedFormControl(true, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.invalid) {
      return;
    }

    const category: Category = {
      name: this.form.value.name,
      description: this.form.value.description,
      is_active: this.form.value.is_active,
      date: new Date(),
    };
    this.categoriesService.create(category).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'categories']);
    });
  }
}
