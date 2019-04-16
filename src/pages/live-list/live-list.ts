import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
@IonicPage()
@Component({
  selector: 'page-live-list',
  templateUrl: 'live-list.html',
})
export class LiveListPage {
  public domainName: string = "";
  public listDaijiLive: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunc: CommonFunctionProvider,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public menuCtrl: MenuController, 
  ) {

    this.domainName = myFunc.domainName;
    this.getDaijiLive();
  }

  getDaijiLive() {
    let data: Observable<any>;
    let url = this.domainName + "mobileHandlers/daijiLive.ashx?mode=list";
    //let url = "http://192.168.1.2/daijiworld/mobileHandlers/daijiLive.ashx?mode=list";
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.listDaijiLive = result;
        loader.dismiss();
      }, error => {
        loader.dismiss();
      });
    });
  }

  goToLiveStream(hpVideoID: number) {
    this.navCtrl.push('LivestreamPage', {
      "hpVideoID": hpVideoID
    });
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

}
