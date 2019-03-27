import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { Market } from '@ionic-native/market';

@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})
export class ListPage {
 newsMode:string;
 dispPageTitle : string;
  public listNews: any;
  intLastNewsID: number;
  public domainName: string = "";
  public strNewsSection: string;
  public listOfNewsInfinite: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpClient,
              public menuCtrl: MenuController,
              public loadingCtrl: LoadingController,
              public myFunc: CommonFunctionProvider,
              private market: Market
              ) {

    this.domainName = myFunc.domainName;

    this.newsMode = navParams.get('newsMode');
    this.dispPageTitle = this.myFunc.displayNewsSection(this.newsMode)
    
    if(this.newsMode=="radio"){
      //alert(this.newsMode);
      this.market.open('are.radio.radiodaijiworld');
    } else if (this.newsMode == "daijiworld247"){
      this.market.open('com.daijiworld247.android');
    }
    else{
      this.dispNewsByCatCode(this.newsMode);
    }
 
  }

  newsDisplay(newsID: number, newsTitle: string, newsComments: number,n_loc :string) {
    let fromPage ="";
    if(this.newsMode =="exclusive"){
      fromPage ="exclusive"
    }else{
      fromPage = "listPage"
    }
    this.navCtrl.push('NewsdisplayPage', {
      "newsID": newsID,
      "newsTitle": newsTitle,
      "newsSection": this.newsMode ,
      "newsComments": newsComments,
      "fromPage": fromPage,
      "n_loc": n_loc
    });
  }

  dispNewsByCatCode(newsSection) {
    let data: Observable<any>;
    //alert(newsSection);
    let url = this.domainName + "mobileHandlers/newsList.ashx?newsMode=" + newsSection;
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.listNews = result;
        let dataLength = this.listNews.length;
        this.intLastNewsID = this.listNews[dataLength - 1].newsID;
        console.log("Last News ID : " + this.intLastNewsID);
        loader.dismiss();
      })
    });
  }
  doInfinite(e): Promise<any> {
    //console.log('Begin async operation');
    //alert(this.newsMode);
    let infinteData: Observable<any>;
    return new Promise((resolve) => {
      setTimeout(() => {
        let infiniteURL = this.domainName + "mobileHandlers/newsList.ashx?newsMode=" + this.newsMode + "&lastNewsID=" + this.intLastNewsID;
        infinteData = this.http.get(infiniteURL);
        //console.log(infinteData);
        infinteData.subscribe(response => {
          console.log(response);
          this.listOfNewsInfinite = response;
          const newData = this.listOfNewsInfinite;
          this.intLastNewsID = this.listOfNewsInfinite[newData.length - 1].newsID;
          for (let i = 0; i < newData.length; i++) {
            this.listNews.push(newData[i]);
          }
          e.complete();
        })
        //console.log('Async operation has ended');
        resolve();
      }, 500);
    })
  }

  
  toggleMenu() {
    this.menuCtrl.toggle();
  }
 
  


}
