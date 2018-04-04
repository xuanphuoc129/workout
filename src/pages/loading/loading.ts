import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppControllerProvider } from '../../providers/app-controller/app-controller';
import { HomePage } from '../home/home';
import { Subscription } from 'rxjs/Subscription';

/**
 * Generated class for the LoadingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-loading',
  templateUrl: 'loading.html',
})
export class LoadingPage {
  loadDataSubscription: Subscription;

  constructor(
    public appController: AppControllerProvider,
    public splashScreen: SplashScreen,
    public navCtrl: NavController, public navParams: NavParams) {
  }
  
  ionViewDidLoad() {
    this.appController.onLoadData();
    this.loadDataSubscription = this.appController.loadedDataChanel.asObservable().subscribe((data) => {
      console.log("On load data sucess",data);
      if(this.appController.loadedData.exercise && this.appController.loadedData.diary 
        && this.appController.loadedData.dataFile && this.appController.loadedData.calendar && this.appController.loadedData.user){
          if(this.appController.user && this.appController.user.language == 1){
            this.appController.language = this.appController.mDataJSON.language.vn;
          }else{
            this.appController.language = this.appController.mDataJSON.language.es;
          }
          this.loadDataSubscription.unsubscribe();
          this.onLoadedData();
        }
    })
  }

  ionViewDidLeave(){
    this.splashScreen.hide();
    this.loadDataSubscription.unsubscribe();
  }

  onLoadedData(){
    this.navCtrl.setRoot(HomePage,"",{
      animate : false
    })
  }

}
