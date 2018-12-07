import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Market } from '@ionic-native/market';
 
@IonicPage()
@Component({
  selector: 'page-dwtv247',
  templateUrl: 'dwtv247.html',
})
export class Dwtv247Page {

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

  openPlayStore() {
    this.market.open('com.daijiworld247.android');
  }

}
