import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
 
@Injectable()
export class CommonFunctionProvider {

  public domainName: string = "https://www.daijiworld.com/"
  //public domainName: string = "http://192.168.1.2/daijiworld/"
  public cricketTokenID: string = "bdcaf1ba8f314f1c683a237d5e6df4ab";
  constructor(public http: HttpClient) {
    //console.log('Hello CommonFunctionProvider Provider');
  }

  displayNewsSection(newsMode: string): string {
    if (newsMode === "homeTopStories") {
      return "TOP STORIES";
    }else if (newsMode === "topstories") {
      return "TOP STORIES";
    }else if (newsMode === "news") {
      return "HEADLINES";
    } else if (newsMode === "kar") {
      return "KARNATAKA";
    } else if (newsMode === "obituary") {
      return "OBITUARY";
    } else if (newsMode === "mah") {
      return "Mumbai";
    } else if (newsMode === "goa") {
      return "GOA";
    } else if (newsMode == "me") {
      return "GULF"
    } else if (newsMode == "usa") {
      return "USA"
    } else if (newsMode == "others") {
      return "India / World"
    } else if (newsMode == "entertainment") {
      return "SHOW BIZ"
    } else if (newsMode == "business") {
      return "BUSINESS"
    } else if (newsMode == "sports") {
      return "SPORTS"
    } else if (newsMode == "health") {
      return "HEALTH"
    } else if (newsMode == "editor") {
      return "EDITOR'S PICK"
    } else if (newsMode == "coastalCineWorld") {
      return "COASTAL CINE WORLD"
    } else if (newsMode == "campusBeat") {
      return "CAMPUS BEAT"
    } else if (newsMode == "exclusive") {
      return "SPECIAL"
    } else if (newsMode == "property") {
      return "PROPERTY"
    } else if (newsMode == "matrimonialMale") {
      return "Matrimonial - Grooms"
    } else if (newsMode == "matrimonialFemale") {
      return "Matrimonial - Brides"
    } else if (newsMode == "classifieds") {
      return "Classifieds"
    } else if (newsMode == "jobs") {
      return "Jobs"
    } else if (newsMode == "recipeCategory") {
      return "Recipes"
    } else if (newsMode == "radio") {
      return "Radio"
    } else if (newsMode == "daijiworld247") {
      return "Daijiworld247"
    }
  }

}
