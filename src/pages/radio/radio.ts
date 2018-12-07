import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Market } from '@ionic-native/market';
 
@IonicPage()
@Component({
  selector: 'page-radio',
  templateUrl: 'radio.html',
})
export class RadioPage {

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      private market: Market,
      public menuCtrl: MenuController,
      ) {
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  openPlayStore(){
    this.market.open('are.radio.radiodaijiworld');
  }

}
