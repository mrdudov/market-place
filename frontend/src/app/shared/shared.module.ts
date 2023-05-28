import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material/material.module';
import { TopPanelComponent } from './components/top-panel/top-panel.component';
import { UserComponent } from './users/user/user.component';
import { CategorySelectorComponent } from './components/category-selector/category-selector.component';
import { ManufacturerSelectorComponent } from './components/manufacturer-selector/manufacturer-selector.component';

@NgModule({
  imports: [CommonModule, HttpClientModule, MaterialModule, RouterModule],
  declarations: [
    TopPanelComponent,
    UserComponent,
    CategorySelectorComponent,
    ManufacturerSelectorComponent,
  ],
  exports: [
    HttpClientModule,
    TopPanelComponent,
    CategorySelectorComponent,
    ManufacturerSelectorComponent,
  ],
})
export class SharedModule {}
