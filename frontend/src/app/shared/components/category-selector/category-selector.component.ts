import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CategoriesService } from '../../categories.service';
import { Category } from '../../interfaces';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
})
export class CategorySelectorComponent implements OnInit {
  @Output() changeCateyory = new EventEmitter();

  category_id: number = 0;
  categories: Category[] = [];

  constructor(private categoriesService: CategoriesService) {
    this.categoriesService.getAll().subscribe((categories) => {
      this.categories = categories;
    });
  }

  ngOnInit(): void {}
}
