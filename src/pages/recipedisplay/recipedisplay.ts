import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-recipedisplay',
  templateUrl: 'recipedisplay.html',
})
export class RecipedisplayPage {
  public domainName: string = "";
  public recipeJson: any;
  newsMode: string;
  recipeCatID:number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public myFunc: CommonFunctionProvider,
    public loadingCtrl: LoadingController,
    public http: HttpClient,
    public menuCtrl: MenuController,
  ) {

    this.domainName = myFunc.domainName;
    this.newsMode = navParams.get('newsMode');
    this.recipeCatID = navParams.get('recipeCatID');
    this.getRecipeListDataByID(this.newsMode, this.recipeCatID);
  }

  getRecipeListDataByID(newsMode, recipeCatID) {
    let data: Observable<any>;
    //alert(newsMode);
    let url = this.domainName + "mobileHandlers/newsList.ashx?newsMode=" + newsMode + "&recipeCatID=" + recipeCatID;
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.recipeJson = result;
        loader.dismiss();
      }, error => {
        loader.dismiss();
      });
    });
  }

  singleRecipebyID(recipeID:number,newsTitle:string,noOfComments:number){
    this.navCtrl.push('RecipeSinglePage',{
      "recipeID": recipeID,
      "newsTitle": newsTitle,
      "newsMode":"recipe_det",
      "noOfComments": noOfComments
    })
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

}
