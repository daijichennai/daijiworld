import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipeSinglePage } from './recipe-single';

@NgModule({
  declarations: [
    RecipeSinglePage,
  ],
  imports: [
    IonicPageModule.forChild(RecipeSinglePage),
  ],
})
export class RecipeSinglePageModule {}
