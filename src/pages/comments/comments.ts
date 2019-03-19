import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { AlertController } from "ionic-angular";
import { CommonFunctionProvider } from '../../providers/common-function/common-function';

//import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {
  authForm: FormGroup;
  public type = 'password';
  public showPass = false;
  public domainName: string = "";
  public hideShow: boolean = false;
  public hideShowConfirmPwd: boolean = false;
  public isChkLsEmail: boolean = false;
  public userEmail: string;
  public userName: string;
  public userComments: string;
  public userPlace:string;
  public intNewsID:number;
  public strNewsTitle: string;
  public ecID: number;
  public strNewsSection:string;
  public commentMode:string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public http: HttpClient,
    public alertCtrl: AlertController,
    public myFunc: CommonFunctionProvider
  ) {

    //this.domainName = "https://www.daijiworld.com/"
    this.intNewsID = navParams.get('newsID');
    this.domainName = myFunc.domainName;
    this.strNewsTitle = navParams.get('newsTitle');
    this.strNewsSection = navParams.get('newsSection')
    this.ecID = navParams.get('ecID');
    this.commentMode = navParams.get('commentMode');

    //alert(this.strNewsSection);

    this.authForm = this.fb.group({
      'ecUserName': [null, Validators.compose([Validators.required])],
      'ecUserPlace': [null, Validators.compose([Validators.required])],
      'ecUserEmail': ['', Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])],
      'ecComments': [null, Validators.compose([Validators.required])]
    })  
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad CommentsPage');
    
  }

  insertComments() {
    let insCommentURL = ""
    let parentID =0
    if (this.commentMode =="reply"){
      parentID = this.ecID;
    }

    if (this.commentMode == "reportAbuse") {
      insCommentURL = this.domainName + "mobileHandlers/androidEmailComments.ashx?mode=insRptAbuse&ecID=" + this.ecID + "&ecName=" + this.userName + "&ecEmail=" + this.userEmail + "&ecComments=" + this.userComments;
    } else {
      insCommentURL = this.domainName + "mobileHandlers/androidEmailComments.ashx?mode=insComment&ecParentID=" + parentID + "&ecTitle=" + this.strNewsTitle + "&ecName=" + this.userName + "&ecEmail=" + this.userEmail + "&ecComments=" + this.userComments + "&ecPlace=" + this.userPlace + "&newsID=" + this.intNewsID + "&referedPage=" + this.strNewsSection + "&newsSection=" + this.strNewsSection;
    }


    //insCommentURL = this.domainName + "mobileHandlers/androidEmailComments.ashx?mode=insComment&ecParentID=" + parentID +"&ecTitle=" + this.strNewsTitle + "&ecName=" + this.userName + "&ecEmail=" + this.userEmail + "&ecComments=" + this.userComments + "&ecPlace=" + this.userPlace + "&newsID=" + this.intNewsID + "&referedPage=" + this.strNewsSection;
    this.http.post(insCommentURL, "").subscribe(
      data => {
        console.log(data);
        let msg ='';
        if (data[0].msg ==="inserted"){
          msg = 'If your comment adheres to Daijiworld.com norms, it will be published within the next 24 hours.\n Thank You...';
          this.presentAlert(msg);
        } else if (data[0].msg === "errorOccurred"){
          msg = 'Something went wrong.Please try again later';
          this.presentAlert(msg);
        }
        //this.presentAlert()
        this.navCtrl.pop();  
      },
      error => {
        console.log(error);
      });

  }

  presentAlert(msgText) {
    let alert = this.alertCtrl.create({
      title: '',
      subTitle: msgText, // 'If your comment adheres to Daijiworld.com norms, it will be published within the next 24 hours.\n Thank You...',
      buttons: ['Dismiss']
    });
    alert.present();
  }

    
}
