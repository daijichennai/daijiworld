import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListPage } from './list';
import { LazyLoadImageModule } from 'ng2-lazyload-image';
@NgModule({
  declarations: [
    ListPage,
  ],
  imports: [
    LazyLoadImageModule,
    IonicPageModule.forChild(ListPage),
  ],
})
export class ListPageModule {}
