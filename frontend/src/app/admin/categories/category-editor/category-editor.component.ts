import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../../shared/categories.service';
import { Category } from '../../../shared/interfaces';

@Component({
  selector: 'app-category-editor',
  templateUrl: './category-editor.component.html',
  styleUrls: ['./category-editor.component.scss'],
})
export class CategoryEditorComponent implements OnInit {
  form: UntypedFormGroup;

  category: Category | undefined;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, [Validators.required]),
      description: new UntypedFormControl(null, [Validators.required]),
      is_active: new UntypedFormControl(true, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.route.url.subscribe((url) => {
      const category_id = url.pop()!.toString();
      this.getCategory(category_id);
    });
  }

  private getCategory(category_id: string) {
    this.categoriesService
      .getById(parseInt(category_id))
      .subscribe((category) => {
        this.category = category;
        this.setFormValue();
      });
  }

  private setFormValue() {
    this.form.get('name')?.setValue(this.category!.name);
    this.form.get('description')?.setValue(this.category!.description);
    this.form.get('is_active')?.setValue(this.category!.is_active);
  }

  submit() {
    if (this.form.invalid) {
      return;
    }
    this.category!.name = this.form.get('name')?.value;
    this.category!.description = this.form.get('description')?.value;
    this.category!.is_active = this.form.get('is_active')?.value;

    this.categoriesService.update(this.category!).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'categories']);
    });
  }
}
