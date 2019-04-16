import { CommonFunctionProvider } from './../../providers/common-function/common-function';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController} from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
@IonicPage()
@Component({
  selector: 'page-cricket',
  templateUrl: 'cricket.html',
})
export class CricketPage {
  public matchMode: string = '';
  public toolTitle: string = '';
  public cricketJson: any;
  public isHideMatch: boolean = false;
  public tokenID: string;
  public iplJson:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public myFunc: CommonFunctionProvider,
    public menuCtrl: MenuController
  ) {

    this.matchMode = navParams.get('matchMode');
    this.toolTitle = this.titleFn(this.matchMode);
    this.tokenID = this.myFunc.cricketTokenID;
  }

  ionViewDidLoad() {
    if (this.matchMode === "iccRanking"){
      this.getIPLStandings();
    }else{
      this.getData(this.matchMode, this.tokenID);
    }
    
  }
  getData(mode, token) {
    let data: Observable<any>;
    let url = '';
    if (mode === "recent") {
      url = "https://rest.entitysport.com/v2/matches/?status=2&token=" + token + "&paged=1&per_page=80";
    } else if (mode === "live") {
      url = "https://rest.entitysport.com/v2/matches/?status=3&token=" + token + "&paged=1&per_page=80";
    } else if (mode === "upcoming") {
      url = "https://rest.entitysport.com/v2/matches/?status=1&token=" + token + "&paged=1&per_page=80";
    }
    //  else if (mode === "iccRanking") {
    //   url = "https://rest.entitysport.com/v2/iccranks?token=token=bdcaf1ba8f314f1c683a237d5e6df4ab";
    // }  
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result.response.items);
        if (result.response.items != 0) {
          this.cricketJson = result.response.items;
        } else {
          this.isHideMatch = true;
        }
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
  
  toggleMenu() {
    this.menuCtrl.open();
  }
 

  titleFn(mode) {
    if (mode === "live") {
      return "Live"
    } else if (mode === "upcoming") {
      return "Upcoming"
    } else if (mode === "recent") {
      return "Recent"
    } else if (mode === "iccRanking") {
      return "ICC Ranking"
    }
  }

  goToScoreCard(matchID) {
    if (this.matchMode != 'upcoming') {
      this.navCtrl.push('ScorecardPage', {
        "matchID": matchID
      });
    }
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
}
