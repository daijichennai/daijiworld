import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecipedisplayPage } from './recipedisplay';

@NgModule({
  declarations: [
    RecipedisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(RecipedisplayPage),
  ],
})
export class RecipedisplayPageModule {}
