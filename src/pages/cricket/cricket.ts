import { Component, ViewChild } from '@angular/core';
import { IonicPage, Slides, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
@IonicPage()
@Component({
  selector: 'page-cricket',
  templateUrl: 'cricket.html',
})
export class CricketPage {
  @ViewChild('slider') slider: Slides;
  @ViewChild("segments") segments;
  page: any;
  items = [];
  public iplJson: any;
  public recentJson: any;
  public upcomingJson: any;
  public liveJson: any;
  public isHideRecentMatch: boolean = false;
  public isHideUpcomingMatch: boolean = false;
  public isHideLiveMatch: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public myFunc: CommonFunctionProvider,
  ) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CricketPage');
  }

  getMatches(status) {
    let data: Observable<any>;
    let url = '';

    url = "https://rest.entitysport.com/v2/matches/?status=" + status + "&token=" + this.myFunc.cricketTokenID + "&paged=1&per_page=80";

    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        if (status === 3) {
          if (result.response.items != 0) {
            this.liveJson = result.response.items;
          } else {
            this.isHideLiveMatch = true;
          }

        } else if (status === 1) {
          if (result.response.items != 0) {
            this.upcomingJson = result.response.items;
          } else {
            this.isHideUpcomingMatch = true;
          }

        } else if (status === 2) {
          if (result.response.items != 0) {
            this.recentJson = result.response.items;
          } else {
            this.isHideRecentMatch = true;
          }
        }

        console.log(result.response.items);

        loader.dismiss();
      }, error => {
        loader.dismiss();
      });
    });
  }

  getIPLStandings() {
    let data: Observable<any>;
    let url = "https://rest.entitysport.com/v2/competitions/112588/standings/?token=" + this.myFunc.cricketTokenID;

    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.iplJson = result.response.standings[0].standings;
        loader.dismiss();
      },
        error => {
          loader.dismiss();
        });
    });
  }

  iplLogo(teamName, teamLogo) {
    if (teamName === "Sunrisers Hyderabad") {
      return "http://www.daijiworld.in/images3/sunrisersHyderabad.png";
    } else if (teamName === "Rajasthan Royals") {
      return "http://www.daijiworld.in/images3/rajasthanRroyals.png";
    } else if (teamName === "Royal Challengers Bangalore") {
      return "http://www.daijiworld.in/images3/royalChallengers.png";
    } else if (teamName === "Kings XI Punjab") {
      return "http://www.daijiworld.in/images3/punjabKings.png";
    } else if (teamName === "Delhi Capitals") {
      return "http://www.daijiworld.in/images3/delhiDaredevils.jpg";
    } else if (teamName === "Kolkata Knight Riders") {
      return "http://www.daijiworld.in/images3/kolkataKnightRiders.png";
    } else if (teamName === "Mumbai Indians") {
      return "http://www.daijiworld.in/images3/mumbaiIndians.png";
    } else if (teamName === "Chennai Super Kings") {
      return "http://www.daijiworld.in/images3/csk.png";
    } else {
      return teamLogo;
    }
  }

  goToScoreCard(mID) {
    this.navCtrl.push('ScorecardPage', {
      "matchID": mID
    })
  }

  convertDate(dateValue) {
    var d = new Date(dateValue);
    var monthNames = ["Jan", "Feb", "Mar", "Apl", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var day = d.getDate();
    var monthIndex = d.getMonth();
    var year = d.getFullYear();
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
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
    
    if (this.page === "3") {
      this.getIPLStandings();

    } else if (this.page === "2") { // Live
      this.getMatches(3);   //Live

    } else if (this.page === "1") {   //Upcoming
      this.getMatches(1);        //Upcoming

    }
    else if (this.page === "0") {   //Recent
      this.getMatches(2);        //Recent
    }

    this.centerScroll();
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

  // Easing function
  easeInOutQuart(time, from, distance, duration) {
    if ((time /= duration / 2) < 1) return distance / 2 * time * time * time * time + from;
    return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

}
