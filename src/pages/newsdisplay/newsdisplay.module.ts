import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewsdisplayPage } from './newsdisplay';

@NgModule({
  declarations: [
    NewsdisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(NewsdisplayPage),
  ],
})
export class NewsdisplayPageModule {}
