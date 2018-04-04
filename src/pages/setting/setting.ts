import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AppControllerProvider } from '../../providers/app-controller/app-controller';
import { Users } from '../../providers/class/user';

/**
 * Generated class for the SettingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  isVn: boolean = true;
  isVibration: boolean = true;
  isAlarm: boolean = true;
  user: Users;
  language: any;
  constructor(
    private mAlertController: AlertController,
    private appController: AppControllerProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.user = new Users();
    this.loadLanguage();
    if (this.appController.user) this.user = this.appController.user;
    this.isVibration = this.user.notification.vibration;
    this.isAlarm = this.user.notification.alarm;
    this.isSound = this.user.notification.sound;
  }

  loadLanguage(){
    console.log(this.appController.getLanguage());
    this.language = this.appController.getLanguage().settings;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
    this.translateBg1();
    this.translateBg2();
    this.translateBg3();
  }

  loginFacebook() {
    if (this.user.facebook != "Not connected" && this.user.google != "Chưa kết nối") return;
    this.appController.showLoading();
    this.appController.loginWithFacebook().then((sucess) => {
      this.appController.hideLoading();
      this.appController.showToast(sucess);
    }).catch((err) => {
      this.appController.hideLoading();
      this.appController.showToast(err);
    })
  }

  loginGoogle(){
    if(this.user.google != "Not connected" && this.user.google != "Chưa kết nối") return;
    this.appController.showLoading();
    this.appController.loginWithGoogle().then((sucess)=>{
      this.appController.hideLoading();
      this.appController.showToast(sucess);
    }).catch((err)=>{
      this.appController.hideLoading();
      this.appController.showToast(err);
    })
  }

  changeIsVn(number) {
    this.user.language = number;
    this.user.updateUser();
    if(number ==1){
      this.appController.language = this.appController.mDataJSON.language.vn;
    }else{
      this.appController.language = this.appController.mDataJSON.language.es;
    }
    this.loadLanguage();
    this.appController.loadedDataChanel.next("vn");
    this.updateUser();
  }

  updateUser() {
    this.appController.updateUser(this.user).then(() => {
    }).catch((err) => {
    })
  }

  changeVibration() {
    this.isVibration = !this.isVibration;
    this.user.notification.vibration = this.isVibration;
    this.translateBg1();
    this.updateUser();
  }
  translateBg1() {
    let element = document.getElementById("bg1");
    if (element) {
      if (this.isVibration) {
        element.style.transform = "translateX(100%)";
      } else {
        element.style.transform = "translateX(0)";
      }
    }
  }
  translateBg2() {
    let element = document.getElementById("bg2");
    if (element) {
      if (this.isAlarm) {
        element.style.transform = "translateX(100%)";
      } else {
        element.style.transform = "translateX(0)";
      }
    }
  }
  translateBg3() {
    let element = document.getElementById("bg3");
    if (element) {
      if (this.isSound) {
        element.style.transform = "translateX(100%)";
      } else {
        element.style.transform = "translateX(0)";
      }
    }
  }

  changeIsAlarm() {
    this.isAlarm = !this.isAlarm;
    this.user.notification.alarm = this.isAlarm;
    this.translateBg2();
    this.updateUser();
  }
  isSound: boolean = true;
  changeIsSound() {
    this.isSound = !this.isSound;
    this.user.notification.sound = this.isSound;
    this.translateBg3();
    this.updateUser();
  }

  showPromt(type) {
    var placeholder = "";
    if(type == 1){
      placeholder = this.language.placehodlerHeight;
    }else{
      placeholder = this.language.placehodlerWeight;
    }
    let alert = this.mAlertController.create({
      title: this.language.physic,
      inputs: [
        {
          placeholder: placeholder,
          name: "input"
        }
      ],
      buttons: [
        {
          text: this.language.cancel
        },
        {
          text: this.language.ok,
          handler: data => {
            if(data.input && parseInt(data.input) && parseInt(data.input) > 0){
              if(type == 1){
                this.user.physic.height = parseInt(data.input);
              }else{
                this.user.physic.weight = parseInt(data.input);
              }
              this.updateUser();
            }
          }
        }
      ]
    })
    alert.present();
  }
}
