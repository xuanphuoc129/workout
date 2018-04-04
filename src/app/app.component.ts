import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = "LoadingPage";
  selectedIndex : number  = 0;
  // rootPage: any = HomePage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage,icon: "workout-icon-home" },
      { title: 'Check-in', component: "CheckInPage", icon: "workout-icon-checkin" },
      { title: 'FAQ', component: "FaqPage",icon: "workout-icon-faq" },
      { title: 'Setting', component: "SettingPage", icon: "workout-icon-setting" }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();//
      this.statusBar.styleLightContent();
      // this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  goToPage(component,i){
    this.selectedIndex = i;
    this.nav.setRoot(component);
  }
}
