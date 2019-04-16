import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CricketPage } from './cricket';

@NgModule({
  declarations: [
    CricketPage,
  ],
  imports: [
    IonicPageModule.forChild(CricketPage),
  ],
})
export class CricketPageModule {}
