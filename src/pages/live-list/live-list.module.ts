import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LiveListPage } from './live-list';

@NgModule({
  declarations: [
    LiveListPage,
  ],
  imports: [
    IonicPageModule.forChild(LiveListPage),
  ],
})
export class LiveListPageModule {}
