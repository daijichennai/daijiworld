import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-livestream',
  templateUrl: 'livestream.html',
})
export class LivestreamPage {
 
  public domainName: string = "";
  public dwWeeklyJson: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunc: CommonFunctionProvider,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public menuCtrl: MenuController,
  ) {

    // this.domainName = myFunc.domainName;
    // this.getDaijiLiveData();
  }

   getDaijiLiveData() {
    let data: Observable<any>;
    //alert(newsSection);
    //let url = this.domainName + "mobileHandlers/daijiLive.ashx";
     let url = "http://192.168.1.2/daijiworld/mobileHandlers/daijiLive.ashx";

    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.dwWeeklyJson = result;
        loader.dismiss();
      })
    });
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }
}
