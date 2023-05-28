import { Pipe, PipeTransform } from '@angular/core';
import { Category } from 'src/app/shared/interfaces';

@Pipe({
  name: 'searchCategories',
})
export class SearchPipe implements PipeTransform {
  transform(categories: Category[], search: string = ''): Category[] {
    if (!search.trim()) {
      return categories;
    }
    return categories.filter((category) => {
      return category.name.toLowerCase().includes(search.toLowerCase());
    });
  }
}
