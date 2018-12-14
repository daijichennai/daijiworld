import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { LazyLoadImageModule } from 'ng2-lazyload-image';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SocialSharing } from "@ionic-native/social-sharing";
import { NetworkProvider } from '../providers/network/network';
import { Network } from "@ionic-native/network";
import { CommonFunctionProvider } from '../providers/common-function/common-function';
import { Market } from '@ionic-native/market';
import { Firebase } from '@ionic-native/firebase';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule, HttpClientModule, LazyLoadImageModule ,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NetworkProvider,
    Network,
    Market,
    Firebase,
    InAppBrowser,
    CommonFunctionProvider
  ]
})
export class AppModule {}
