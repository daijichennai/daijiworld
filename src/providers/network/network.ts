import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from "@ionic-native/network";
import { Events } from 'ionic-angular';

export enum ConnectionstatusEnum {
  online,
  offline
}

@Injectable()
export class NetworkProvider {
  previousStatus: any;
  constructor(public http: HttpClient, public network: Network, public eventCtrl: Events) {
    //alert('Hello NetworkProvider Provider');
    this.previousStatus = ConnectionstatusEnum.online;
  }


  public initializeNewtorkEvent(): void {
    this.network.onDisconnect().subscribe(() => {
      if (this.previousStatus === ConnectionstatusEnum.online) {
        this.eventCtrl.publish('network:offline');
      }
      this.previousStatus === ConnectionstatusEnum.offline;
    });

    this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        if (this.previousStatus === ConnectionstatusEnum.offline) {
          this.eventCtrl.publish('network:online');
        }
        this.previousStatus === ConnectionstatusEnum.online;
      }, 3000);
    });

  }

}
