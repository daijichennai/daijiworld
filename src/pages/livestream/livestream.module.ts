import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LivestreamPage } from './livestream';

@NgModule({
  declarations: [
    LivestreamPage,
  ],
  imports: [
    IonicPageModule.forChild(LivestreamPage),
  ],
})
export class LivestreamPageModule {}
