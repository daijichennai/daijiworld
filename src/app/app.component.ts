import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController, Events, App, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../pages/home/home';
import { Subscription } from '../../node_modules/rxjs/Subscription';
import { Network } from "@ionic-native/network";
import { NetworkProvider } from '../providers/network/network';
import { Firebase } from '@ionic-native/firebase';
import { CommonFunctionProvider } from '../providers/common-function/common-function';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;
  toastInstance: any;
  connected: Subscription;
  disconnected: Subscription;
  public toastConnectedCount: number = 0;
  public domainName: string = "";

  pages: Array<{ title: string, component: any, icon: string, newsMode: string }>;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public http: HttpClient,
    public network: Network,
    public toast: ToastController,
    public networkProvider: NetworkProvider,
    public events: Events,
    public app: App,
    public alertCtrl: AlertController,
    public splashScreen: SplashScreen,
    public fireBase: Firebase,
    public myFunc: CommonFunctionProvider
    ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'News', component: HomePage, icon: 'fa fa-bars',newsMode : '' },
      { title: 'Special', component: 'ListPage', icon: 'fa fa-star', newsMode: 'exclusive'},
      { title: 'Properties', component: 'ListPage', icon: 'fa fa-building', newsMode: 'property'},
      { title: 'Matrimonial-Groom', component: 'ListPage', icon: 'fa fa-mars', newsMode: 'matrimonialMale' },
      { title: 'Matrimonial-Bride', component: 'ListPage', icon: 'fa fa-venus', newsMode: 'matrimonialFemale' },
      { title: 'Jobs', component: 'ListPage', icon: 'fa fa-handshake-o', newsMode: 'jobs'},
      { title: 'Classifieds', component: 'ListPage', icon: 'fa fa-bullseye', newsMode: 'classifieds' },
      { title: 'Recipes', component: 'RecipeListPage', icon: 'fa fa-cutlery', newsMode: 'recipeCategory' },
      { title: 'Daijiworld Weekly', component: 'DwweeklyPage', icon: 'fa fa-newspaper-o', newsMode: 'weekly' },
      { title: 'Daijiworld 24*7', component: 'ListPage', icon: 'fa fa-television', newsMode: 'daijiworld247' },
      { title: 'Radio', component: 'ListPage', icon: 'fa fa-headphones', newsMode: 'radio' },
      { title: 'Settings', component: 'SettingsPage', icon: 'fa fa-cog', newsMode: 'settings' },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();

      this.splashScreen.hide();

      this.platform.registerBackButtonAction(() => {
        let nav = this.app.getActiveNav();
        if (nav.canGoBack()) { //Can we go back?
          nav.pop();
        } else {
          this.exitFunction();
        }
      });

      this.domainName = this.myFunc.domainName;

      this.fireBase.getToken().then(token => {
        //alert('Token ID = ' + token);;
        this.pushDeviceID(token);
        window.localStorage.setItem("token", token);
      }, err => {
        //alert("token Error = " + err)
      });

      this.fireBase.onNotificationOpen().subscribe(data => {
        this.pushNotificationRedirect();
      }, err => console.log(err));


    });
  }

  exitFunction() {
    let alert = this.alertCtrl.create({
      title: 'Exit Daijiworld ?',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present();
  }   

  pushNotificationRedirect() {
    this.nav.push(HomePage);
  }

  pushDeviceID(tokenID) {
    let insTokenURL = this.domainName + "mobileHandlers/addAndroidDeviceID.ashx?deviceMode=insert&deviceID=" + tokenID;
    this.http.post(insTokenURL, "").subscribe(
      data => {
        if (data[0].status === "success") {
          //alert(data[0].status);
        }
        //console.log(data[0].status); 
      },
      error => {
        //alert("Error = " + error);
        //console.log(error);
      });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component,{
      "newsMode":page.newsMode
    });
  }
}
