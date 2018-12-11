import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'safe' })
@IonicPage()
@Component({
  selector: 'page-livestream',
  templateUrl: 'livestream.html',
})
export class LivestreamPage implements PipeTransform {
 
  public domainName: string = "";
  public liveJson: any;
  public intHpVideoID :number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunc: CommonFunctionProvider,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public menuCtrl: MenuController,
    public sanitizer: DomSanitizer
  ) {

    this.intHpVideoID = navParams.get('hpVideoID');
    //alert(this.intHpVideoID);
     this.domainName = myFunc.domainName;
    this.getDaijiLiveData(this.intHpVideoID);
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

   getDaijiLiveData(hpVideoID) {
    let data: Observable<any>; 
    let url = this.domainName + "mobileHandlers/daijiLive.ashx?mode=selectByID&hpVideoID=" + hpVideoID;
     //let url = "http://192.168.1.2/daijiworld/mobileHandlers/daijiLive.ashx?mode=selectByID&hpVideoID=" + hpVideoID;

    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.liveJson = result;
        loader.dismiss();
      })
    });
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }
}
