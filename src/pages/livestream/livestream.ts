import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import { InAppBrowser, InAppBrowserOptions  } from '@ionic-native/in-app-browser';
import { ScreenOrientation } from "@ionic-native/screen-orientation";

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
    public sanitizer: DomSanitizer,
    private iab: InAppBrowser,
    public screenOrientation: ScreenOrientation,
  ) {

    this.intHpVideoID = navParams.get('hpVideoID');
    //alert(this.intHpVideoID);
     this.domainName = myFunc.domainName;
    this.getDaijiLiveData(this.intHpVideoID);
      
  }

  goLive(){
    this.getDaijiLiveData(this.intHpVideoID);
  }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


  lockLandscape() {
    //alert('Orientation locked landscape.');
    this.screenOrientation.lock('landscape');
  }


  lockPortrait() {
    //alert('Orientation locked portrait.');
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

  openWebpage(url: string) {
    this.lockLandscape();
    const options: InAppBrowserOptions = {
      toolbar: 'no',
      location: 'no',
      zoom: 'no',
      fullscreen: 'yes',
    }

    // Opening a URL and returning an InAppBrowserObject
    //this.iab.create(url, '_system', options);
    const browser = this.iab.create(url, '_blank', options);
    browser.on('exit').subscribe(event => {
      //alert('exit');
      this.lockPortrait()
    });
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
        //console.log(result[0].hpVideoCode);
        this.liveJson = result;
        if (result[0].hpVideoMode == "Youtube"){
          this.openWebpage(result[0].hpVideoCode);
        }        
        loader.dismiss();
      }, error => {
        loader.dismiss();
      });
    });
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }
}
