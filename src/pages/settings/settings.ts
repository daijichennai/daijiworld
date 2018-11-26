import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { CommonFunctionProvider } from '../../providers/common-function/common-function';
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  public tokenID: string = "";
  public domainName: string = "";
  chkDevicePushEnable: boolean;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public myFunc: CommonFunctionProvider
    ) {

    this.domainName = this.myFunc.domainName;

    if ((window.localStorage.getItem("token") == null) || (window.localStorage.getItem("token") == undefined)) {
      this.tokenID = "";
    }
    else {
      this.tokenID = window.localStorage.getItem("token");
    }

    this.chkDevicePushID();
  }
  chkDevicePushID() {
    //alert("ask")
    let chkDeviceIDURL = this.domainName + "mobileHandlers/addAndroidDeviceID.ashx?deviceMode=selectByDeviceID&deviceID=" + this.tokenID;
    this.http.post(chkDeviceIDURL, "").subscribe(
      data => {
        this.chkDevicePushEnable = data[0].devicePushEnabled;
      },
      error => {
        // alert("Error = " + error.tostring);
        // console.log(error);
      });
  }


  updateDeviceID() {
    let upDeviceID = this.domainName + "mobileHandlers/addAndroidDeviceID.ashx?deviceMode=update&deviceID=" + this.tokenID + "&devicePushEnable=" + this.chkDevicePushEnable;
    this.http.post(upDeviceID, "").subscribe(
      data => {
        //alert(data);
      },
      error => {
        // alert("Error = " + error.tostring);
        // console.log(error);
      });
  }

}
