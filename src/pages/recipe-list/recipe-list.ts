import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, MenuController } from 'ionic-angular';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';


@IonicPage()
@Component({
  selector: 'page-recipe-list',
  templateUrl: 'recipe-list.html',
})
export class RecipeListPage {
  public domainName: string = "";
  public recipeJson: any;
  newsMode: string;
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
    this.getRecipeListData(this.newsMode);
    }


  recipeListByID(recipeCatID:number){
    //alert(recipeCatID);
    this.navCtrl.push('RecipedisplayPage',{
      "recipeCatID": recipeCatID,
      "newsMode":"recipeList"
    })
  }

  getRecipeListData(newsMode) {
    let data: Observable<any>;
    //alert(newsSection);
    let url = this.domainName + "mobileHandlers/newsList.ashx?newsMode=" + newsMode;
    let loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    data = this.http.get(url);
    loader.present().then(() => {
      data.subscribe(result => {
        console.log(result);
        this.recipeJson = result;
        loader.dismiss();
      })
    });
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }
}
