import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SocialSharing } from "@ionic-native/social-sharing";
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-newsdisplay',
  templateUrl: 'newsdisplay.html',
})
export class NewsdisplayPage {
  public singleNewsData: any;
  intNewsID: number;
  public newsTitle: string;
  strNewsSection: string;
  dispNewsSectionName: string;
  public intNewsComments :number;
  public domainName: string = "";
  public myDate: Date = new Date();
  public newsCommentsData: any;
  public hideShowDiv: boolean = false;
  public fromPage:string="";
  public showAgreeDisagree:boolean;
  public showThumbsUp:boolean;

  public isIframe: boolean = false;
  public iframeURL: string = "";
  public n_loc : string = "";

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public socialSharing: SocialSharing,
    public myFunc: CommonFunctionProvider,
    public sanitizer: DomSanitizer

  ) {

    this.domainName = myFunc.domainName;
    
    this.intNewsID = navParams.get('newsID');
    this.newsTitle = navParams.get('newsTitle');
    this.strNewsSection = navParams.get('newsSection');
    this.intNewsComments = navParams.get('newsComments');
    this.fromPage = navParams.get('fromPage');
    this.n_loc = navParams.get('n_loc');
    this.dispNewsSectionName = this.myFunc.displayNewsSection(this.strNewsSection);
    //alert(this.strNewsSection);

    if (this.strNewsSection === "matrimonialMale" || this.strNewsSection === "matrimonialFemale" || this.strNewsSection === "jobs"){
        this.newsDisplayByID(this.intNewsID, this.strNewsSection);
    }else{
      this.newsDisplayByID(this.intNewsID, this.n_loc);
    }
     //this.newsDisplayByID(this.intNewsID, this.strNewsSection);
    //this.newsDisplayByID(this.intNewsID, this.n_loc);

   
   
    //this.displayEmailCommentsByNewsID(538813);
  }

  // closeModel(){
  //   this.navCtrl.pop();
  // }

  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  chkIframe(newsDesc) {
    var iframeRegex = /(?:<iframe[^>]*)(?:(?:\/>)|(?:>.*?<\/iframe>))/g;
    var findIframe = newsDesc.match(iframeRegex);

    if (newsDesc.match(iframeRegex)) {
      this.isIframe = true;

      var srcRegex = /\s*\s*"(.+?)"/g;
      var findIframeUrl = findIframe[0].match(srcRegex);

      this.iframeURL = findIframeUrl[0].replace(/"/g, "");

      console.log(findIframeUrl[0].replace(/"/g, ""));
    }
  }


  displayEmailCommentsByNewsID(newsID: number) {
    let newsComment: Observable<any>;

    //let url = this.domainName + "mobileHandlers/androidEmailComments.ashx?mode=dispComment&newsID=" + newsID + "&newsSection=" + this.strNewsSection;
    let url = this.domainName + "mobileHandlers/androidEmailComments.ashx?mode=dispComment&newsID=" + newsID + "&newsSection=" + this.n_loc;
    newsComment = this.http.get(url);
    newsComment.subscribe(commentResult => {
      this.newsCommentsData = commentResult;
      //console.log(commentResult);
    })
  }

  agreeDisAgreeFn(agreeMode, ecID) {
  console.log('ECID =='+ ecID);
    
    let agreeDisagreeURL = this.domainName + "mobileHandlers/emailCommentsAgreeDisagree.ashx?ecID=" + ecID + "&agreeDisagree=" + agreeMode;
    console.log(this.domainName);
    this.http.post(agreeDisagreeURL, "").subscribe(
      data => {
        console.log(data);
        if (data[0].agreeMode === "agree") {
          document.getElementById('upAgreeValue' + ecID).innerHTML = "&nbsp; " + data[0].count;
        } else if (data[0].agreeMode === "disagree") {
          document.getElementById('upDisagreeValue' + ecID).innerHTML = "&nbsp; " + data[0].count;
        }
        // console.log(data[0].agreeMode);
        // console.log(data[0].count);
      },
      error => {
        console.log(error);
      });


  }


  commentsPageFn() {
    this.navCtrl.push('CommentsPage',{
      "newsTitle": this.newsTitle,
      "newsID":this.intNewsID,
      "newsSection": this.n_loc
    });
  }

  replyFn(ecID: number, commentMode:string){
    this.navCtrl.push('CommentsPage', {
      "commentMode": commentMode,
      "ecID": ecID,
      "newsTitle": this.newsTitle,
      "newsID": this.intNewsID,
      "newsSection": this.n_loc
    });
  }

  newsDisplayByID(newsID: number,newsMode :string) {
    //console.log(newsMode);
    if (newsMode =="homeTopStories"){
      newsMode ="topstories";
    } 
    let data: Observable<any>;
    // alert(newsID);
    // alert(newsMode);
    let url = this.domainName + "mobileHandlers/singleNews.ashx?newsID=" + newsID + "&newsMode=" + newsMode;
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present().then(() => {
      data = this.http.get(url);
      data.subscribe(result => {
        // console.log(result);
        // console.log(result[0].showLikeDislike);
        this.singleNewsData = result;
        this.showAgreeDisagree = result[0].showLikeDislike;
        this.showThumbsUp = result[0].showThumbsUp;
        loader.dismiss();
        //console.log(result[0].newsDesc); 
        this.chkIframe(result[0].newsDesc);
      
        //alert(this.intNewsComments);
        if (this.intNewsComments != 0) {
          this.hideShowDiv = true;
        }
        this.displayEmailCommentsByNewsID(this.intNewsID);
      },error=>{
        loader.dismiss();
      });
    });
  }

  chkSubLvlBgColor(path) {
    if (path === 0) {
      return "grayColor";
    }
    else if (path === 1) {
      return "greenColor";
    }
    else if (path === 2) {
      return "violetColor";
    }
    else if (path === 3) {
      return "orangeColor";
    }
  }

  shareNews() {
    //alert(this.newsID);
    let shareLink = "";
    if (this.n_loc ==="obituary"){
      shareLink = this.domainName + "chan/obituaryDisplay.aspx?obituaryID=" + this.intNewsID;
    } else if (this.n_loc === "exclusive"){
      shareLink = this.domainName + "chan/exclusiveDisplay.aspx?articlesID=" + this.intNewsID;
    }else if (this.n_loc === "property") {
      shareLink = this.domainName + "classifieds/properties.aspx?pID=" + this.intNewsID;
    } else if (this.n_loc === "matrimonial") {
      shareLink = this.domainName + "classifieds/matrimonial.aspx?mID=" + this.intNewsID;
    } else if (this.n_loc === "jobs_classifieds") {
      shareLink = this.domainName + "classifieds/jobs.aspx?jID=" + this.intNewsID;
    } else if (this.n_loc === "classifieds") {
      shareLink = this.domainName + "classifieds/classifieds.aspx?cID=" + this.intNewsID;
    }else{
      shareLink = this.domainName + "news/newsDisplay.aspx?newsID=" + this.intNewsID;
    }
    // alert(this.n_loc);
    //let shareLink = this.domainName + "news/newsDisplay.aspx?newsID=" + this.intNewsID;
    this.socialSharing.share(this.newsTitle, null, null, shareLink).then(() => {
      console.log('success');
    }).catch((error) => {
      console.log(error);
      console.log('error');
    });
  }
  toggleMenu() {
    this.menuCtrl.toggle();
  }
 
}
