import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-dwweekly',
  templateUrl: 'dwweekly.html',
})
export class DwweeklyPage {
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

    this.domainName = myFunc.domainName;
    this.getDwWeeklyData();
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad DwweeklyPage');
    
  }
  toggleMenu() {
    this.menuCtrl.toggle();
  }
  getDwWeeklyData() {
    let data: Observable<any>;
    //alert(newsSection);
    let url = this.domainName + "mobileHandlers/dwWeekly.ashx?sID=1283";
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

}
