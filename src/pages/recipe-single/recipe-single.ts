import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-recipe-single',
  templateUrl: 'recipe-single.html',
})
export class RecipeSinglePage {
  public domainName: string = "";
  public singleRecipeJson: any;
  newsMode: string;
  recipeID: number;
  newsTitle:string;
  public recipeComments: any;
  public noOfComments:number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunc: CommonFunctionProvider,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public menuCtrl: MenuController,
  )
   {
    this.domainName = myFunc.domainName;
    this.newsMode = navParams.get('newsMode');
    this.recipeID = navParams.get('recipeID');
    this.newsTitle = navParams.get('newsTitle');
    this.noOfComments = navParams.get('noOfComments');
    //alert(this.noOfComments);
    // alert(this.newsMode);
    // alert(this.recipeID);
    this.getSingleRecipe(this.newsMode, this.recipeID)
    this.getRecipeComments(this.recipeID)
  }

  getSingleRecipe(newsMode, recipeCatID) {
    let data: Observable<any>;
    //alert(newsMode);
    let url = this.domainName + "mobileHandlers/singleNews.ashx?newsMode=" + newsMode + "&newsID=" + recipeCatID;
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.singleRecipeJson = result;
        loader.dismiss();
      }, error => {
        loader.dismiss();
      });
    });
  }

  getRecipeComments(newsID: number) {
    let recipeComm: Observable<any>;
    let url = this.domainName + "mobileHandlers/androidEmailComments.ashx?mode=dispComment&newsID=" + newsID + "&newsSection=" + this.newsMode;
    recipeComm = this.http.get(url);
    recipeComm.subscribe(results => {
      this.recipeComments = results;
      console.log(results);
    })
  }

  commentsPageFn() {
    this.navCtrl.push('CommentsPage', {
      "newsTitle": this.newsTitle,
      "newsID": this.recipeID,
      "newsSection": this.newsMode
    });
  }



  toggleMenu() {
    this.menuCtrl.toggle();
  }

  agreeDisAgreeFn(agreeMode, ecID) {
    console.log('ECID ==' + ecID);

    let agreeDisagreeURL = this.domainName + "mobileHandlers/emailCommentsAgreeDisagree.ashx?ecID=" + ecID + "&agreeDisagree=" + agreeMode;
    console.log(this.domainName);
    this.http.post(agreeDisagreeURL, "").subscribe(
      data => {
        console.log(data);
        if (data[0].agreeMode === "agree") {
          document.getElementById('upAgreeValue' + ecID).innerHTML = "&nbsp; " + data[0].count;
        }  
        console.log(data[0].agreeMode);
        console.log(data[0].count);
      },
      error => {
        console.log(error);
      });


  }

   

}
