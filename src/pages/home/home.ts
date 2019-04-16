import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, NavParams, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { Network } from "@ionic-native/network";
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { SocialSharing } from "@ionic-native/social-sharing";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('slider') slider: Slides;
  @ViewChild("segments") segments;
  page: any;
  items = [];
  public listNews:any;
  public listDaijiLive: any;

  intLastNewsID :number;
  public domainName: string = "";
  public strNewsSection: string;
  public listOfNewsInfinite: any;
  connected: Subscription;
  disconnected: Subscription;
  public toastConnectedCount: number = 0;
  // public intHpVideoID: number;
  // public strHpVideoTitle: string = "";
  // public isHpVideoActive: boolean = false;

  constructor(
      public navCtrl: NavController,
      public http: HttpClient,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public network: Network,
      public toast: ToastController,
      public modalCtrl: ModalController,
      public myFunc: CommonFunctionProvider,
      public socialSharing: SocialSharing,
      ) {
    this.domainName = myFunc.domainName;
    
    this.checkNetwork()
    this.disconnected = this.network.onDisconnect().subscribe(data => {
      this.toastConnectedCount = 0;
      this.toast.create({
        message: 'Oops, your internet connection seems to be off',
        position: 'bottom',
        duration: 3000,
        cssClass: "colorRed",
      }).present();
    });

    this.connected = this.network.onConnect().subscribe(data => {
      this.toastConnectedCount++;
      if (this.toastConnectedCount < 2) {
        this.toast.create({
          message: 'Your are Online Now',
          position: 'bottom',
          duration: 3000,
          cssClass: "colorGreen",
        }).present();
      }
    }); 
   
  }

  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);

    setTimeout(() => {
      //console.log('Async operation has ended');
      this.displayNewsByCatCode();    
      refresher.complete();
    }, 2000);
  }

  checkNetwork() {
    var connectionStatus = navigator.onLine ? 'online' : 'offline';
    if (connectionStatus == "online") {
      //this.displayNewsByCatCode("topstories");
    }
    else {
      this.toast.create({
        message: 'Oops, your internet connection seems to be off',
        position: 'bottom',
        duration: 3000
      }).present();
    }
  }

  newsDisplay(newsID: number, newsTitle: string, newsSection: string,newsComments:number,n_loc :string) {
    this.navCtrl.push('NewsdisplayPage', {
      newsID: newsID,
      newsTitle: newsTitle,
      newsSection: newsSection,
      newsComments: newsComments,
      n_loc: n_loc
    });
    
  }

  displayNewsByCatCode() {
    let data: Observable<any>;
    let url = this.domainName + "mobileHandlers/newsList.ashx?newsMode=" + this.strNewsSection;
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.get(url); 
   loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.listNews = result;
        let dataLength = this.listNews.length;
        //alert(this.listNews[dataLength - 1].slno)
        if (this.strNewsSection == "topstories") {
          this.intLastNewsID = this.listNews[dataLength - 1].slno;
        } else {
          this.intLastNewsID = this.listNews[dataLength - 1].newsID;
        }
      
        console.log("Last News ID : " + this.intLastNewsID);
       loader.dismiss();
      })
    });
  }
  doInfinite(e): Promise<any> {
    //console.log('Begin async operation');
    let infinteData: Observable<any>;
    return new Promise((resolve) => {
      setTimeout(() => {
        let infiniteURL = this.domainName + "mobileHandlers/newsList.ashx?newsMode=" + this.strNewsSection + "&lastNewsID=" + this.intLastNewsID;
        infinteData = this.http.get(infiniteURL);
        //console.log(infinteData);
        infinteData.subscribe(response => {
          console.log(response);
          this.listOfNewsInfinite = response;
          const newData = this.listOfNewsInfinite;
          //console.log(response[0].newsSection);
          if (response[0].newsSection == "topstories") {
            this.intLastNewsID = this.listOfNewsInfinite[newData.length - 1].slno;
          }
          else{
            this.intLastNewsID = this.listOfNewsInfinite[newData.length - 1].newsID;
          }
          //this.intLastNewsID = this.listOfNewsInfinite[newData.length - 1].newsID;
          
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
        // this.intHpVideoID = result[0].hpVideoID;
        // this.isHpVideoActive = result[0].hpVideoActive;
        // this.strHpVideoTitle = result[0].hpVideoTitle;
        loader.dismiss();
      },error=>{
        loader.dismiss();
      });
    });
  }

  shareLiveTv(hpVideoID:number,isActive:boolean,videoTitle:string) {
    //alert(this.newsID);
    let shareLink = "";

    if (isActive == false) {
      shareLink = "https://www.daijiworld247.com/";
    } else {
      shareLink = this.domainName + "news/homeLiveProgram.aspx?hpVideoID=" + hpVideoID;
    }

    this.socialSharing.share(videoTitle, null, null, shareLink).then(() => {
      console.log('success');
    }).catch((error) => {
      console.log(error);
      console.log('error');
    });
  }
 
  // Initialize slider
  ionViewDidEnter() {
    this.slideChanged();
  }

  // On segment click
  selectedTab(index) {
    this.slider.slideTo(index);
    console.log("selectedTab", index)
  }


  // On slide changed
  slideChanged() {
    let currentIndex = this.slider.getActiveIndex();
    let slides_count = this.segments.nativeElement.childElementCount;

    this.page = currentIndex.toString();
    if (this.page >= slides_count)
      this.page = (slides_count - 1).toString();
    this.strNewsSection = this.newsMode(this.page); 
    console.log(this.strNewsSection);

    if (this.strNewsSection ==="live"){
      this.getDaijiLive();
    }else{
      this.displayNewsByCatCode();
    }
    
    this.centerScroll();
  }

  newsMode(pageIndex) {
    if (pageIndex == 0) {
      return "topstories"
    } else if (pageIndex == 1) {
      return "headlines"
    } else if (pageIndex == 2) {
      return "live"
    } else if (pageIndex == 3) {
      return "kar"
    } else if (pageIndex == 4) {
      return "Cricket"
    } else if (pageIndex == 5) {
      return "obituary"
    } else if (pageIndex == 6) {
      return "mah"
    } else if (pageIndex == 7) {
      return "goa"
    } else if (pageIndex == 8) {
      return "me"
    } else if (pageIndex == 9) {
      return "usa"
    } else if (pageIndex == 10) {
      return "others"
    } else if (pageIndex == 11) {
      return "entertainment"
    } else if (pageIndex == 12) {
      return "business"
    } else if (pageIndex == 13) {
      return "sports"
    } else if (pageIndex == 14) {
      return "health"
    } else if (pageIndex == 15) {
      return "editor"
    } else if (pageIndex == 16) {
      return "coastalCineWorld"
    } else if (pageIndex == 17) {
      return "campusBeat"
    }
  }

  centerScroll() {
    if (!this.segments || !this.segments.nativeElement)
      return;

    let sizeLeft = this.sizeLeft();
    let sizeCurrent = this.segments.nativeElement.children[this.page].clientWidth;
    let result = sizeLeft - (window.innerWidth / 2) + (sizeCurrent / 2);

    result = (result > 0) ? result : 0;
    this.smoothScrollTo(result);
  }

  // Get size start to current
  sizeLeft() {
    let size = 0;
    for (let i = 0; i < this.page; i++) {
      size += this.segments.nativeElement.children[i].clientWidth;
    }
    return size;
  }

  // Easing function
  easeInOutQuart(time, from, distance, duration) {
    if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
    return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
  }

  // Animate scroll
  smoothScrollTo(endX) {
    let startTime = new Date().getTime();
    let startX = this.segments.nativeElement.scrollLeft;
    let distanceX = endX - startX;
    let duration = 400;

    let timer = setInterval(() => {
      var time = new Date().getTime() - startTime;
      var newX = this.easeInOutQuart(time, startX, distanceX, duration);
      if (time >= duration) {
        clearInterval(timer);
      }
      this.segments.nativeElement.scrollLeft = newX;
    }, 1000 / 60); // 60 fps
  }

  goToLiveStream(hpVideoID:number){
    this.navCtrl.push('LivestreamPage',{
      "hpVideoID": hpVideoID
    });
  }

  goToLiveList(){
    this.navCtrl.push('LiveListPage');
  }

  goToCricket(matchMode: string) {
    this.navCtrl.push('CricketPage', {
      "matchMode": matchMode
    });
  }


  // goToDwTv247() {
  //   this.navCtrl.push('Dwtv247Page');
  // }

  // goToRadio() {
  //   this.navCtrl.push('RadioPage');
  // }

  // goToDwweekly(){
  //   this.navCtrl.push('DwweeklyPage');
  // }

}
