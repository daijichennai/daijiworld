import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';


@IonicPage()
@Component({
  selector: 'page-scorecard',
  templateUrl: 'scorecard.html',
})
export class ScorecardPage {
  tabs: string = "scorecard";
  public intMatchID: number = 0;
  public scoreCardJson: any;
  public commentaryJson: any;
  public squadTeamAJson: any;
  public squadTeamBJson: any;
  public teamAName: string = "";
  public teamBName: string = "";
  public inningsNumber: number = 1;
  public entireCommentaryJson: any;
  public matchTitle: string;
  public subtitle: string;
  public date_start: string;
  public toss: string;
  public venue: string;
  public location: string;
  public umpires: string;
  public referee: string;
  public matchStatus: string;
  public isHideMatchInfo: boolean = false;
  public isManOfTheMatch: boolean = false;
  public manOfTheMatch: string = "";
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: HttpClient,
              public loadingCtrl: LoadingController,
              public myCommFun: CommonFunctionProvider,
              public menuCtrl: MenuController)
      {
    this.intMatchID = navParams.get('matchID');
    console.log(this.intMatchID);
  }

   
  ionViewDidLoad() {
    this.getScoreCardByID(this.intMatchID);
    this.getMatchSquadByID(this.intMatchID);
  }

  getScoreCardByID(matchID) {
    let data: Observable<any>;
    let url = '';
    url = "https://rest.entitysport.com/v2/matches/" + matchID + "/scorecard?token=" + this.myCommFun.cricketTokenID;
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        this.matchStatus = result.response.status_note;
        this.isManOfTheMatch = this.chkManOfTheMatch(result.response.man_of_the_match.name);

        if (this.isManOfTheMatch) {
          this.manOfTheMatch = result.response.man_of_the_match.name
        }

        this.teamAName = result.response.teama.name;
        this.teamBName = result.response.teamb.name;
        this.matchTitle = result.response.title;
        this.subtitle = result.response.subtitle;
        this.date_start = result.response.date_start;
        this.toss = result.response.toss.text;
        this.venue = result.response.venue.name
        this.location = result.response.venue.location;
        this.umpires = result.response.umpires;
        this.referee = result.response.referee;
        this.isHideMatchInfo = true;

        if (result.response.innings.reverse()[0].number) {
          this.inningsNumber = result.response.innings.reverse()[0].number;
        } else if (result.response.innings.reverse()[1].number) {
          this.inningsNumber = result.response.innings.reverse()[1].number;
        } else {
          this.inningsNumber = 1;
        }

        this.getCommentaryByID(matchID, this.inningsNumber);
        this.scoreCardJson = result.response.innings;
        console.log(result.response.innings.reverse());
        loader.dismiss();
        setInterval(() => {
          loader.dismiss();
        }, 5000);
      },
        error => {
          loader.dismiss();
        });
    });
  }

  getCommentaryByID(matchID, innings) {
    let data: Observable<any>;
    let url = '';
    // let loader = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    url = "https://rest.entitysport.com/v2/matches/" + matchID + "/innings/" + innings + "/commentary?token=" + this.myCommFun.cricketTokenID;
    data = this.http.get(url);
    //loader.present().then(() => {  
    data.subscribe(result => {
      //console.log(result.response.commentaries.reverse());
      this.entireCommentaryJson = result;
      this.commentaryJson = result.response.commentaries.reverse();
      //loader.dismiss();

    }, error => {
      // loader.dismiss();
      console.log('Error occured in Cricket Commentary');
    });
    // });
  }

  getMatchSquadByID(matchID) {
    let data: Observable<any>;
    let url = '';
    url = "https://rest.entitysport.com/v2/matches/" + matchID + "/squads?token=" + this.myCommFun.cricketTokenID;
    data = this.http.get(url);
    data.subscribe(result => {
      //console.log(result.response.teama.squads);
      this.squadTeamAJson = result.response.teama.squads;
      this.squadTeamBJson = result.response.teamb.squads;
    }, error => {
      console.log('Error occured in Cricket Commentary');
    });
  }


  toggleMenu() {
    this.menuCtrl.toggle();
  }

  chkManOfTheMatch(manOfTheMatch) {
    if (typeof manOfTheMatch !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }

  chkUndefined(ball, event, over) {
    if (event === 'overend') {
      return ""
    } else {
      return over + "." + ball;
    }
  }

  chkHowOut(chkOut, batsmanRun, batsmanBall) {
    if (typeof chkOut !== 'undefined') {
      return "<b class='colorRed' >OUT! " + chkOut + " " + batsmanRun + " (" + batsmanBall + ")" + "</b>";
    } else {
      return "";
    }
  }

  convertUppercase(score) {
    if (score === "w") {
      return "<b class='colorRed'>W</b>"
    } else {
      return score;
    }
  }

  chkWicket(event, commentary) {
    if (event === 'wicket') {
      return "<b class='colorRed' >" + commentary + "</b>"
    } else {
      return commentary;
    }
  }

  convertDate(dateValue) {
    var d = new Date(dateValue);
    var monthNames = ["Jan", "Feb", "Mar", "Apl", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var day = d.getDate();
    var monthIndex = d.getMonth();
    var year = d.getFullYear();
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

  convToIST(myDate) {
    var dateUTC = new Date(myDate);
    var ISTOffset = 330;   // IST offset UTC +5:30 
    var ISTTime = new Date(dateUTC.getTime() + (ISTOffset) * 60000);
    var hoursIST = ISTTime.getHours()
    var minutesIST: any = ISTTime.getMinutes()
    if (minutesIST === "0") {
      minutesIST = "00"
    }
    var ISTNow = hoursIST + ":" + minutesIST
    return ISTNow;
  }


}
