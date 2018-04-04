import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AppControllerProvider } from '../providers/app-controller/app-controller';

import { IonicStorageModule } from '@ionic/storage';
import { Http,HttpModule } from "@angular/http";
import { Facebook} from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Vibration } from '@ionic-native/vibration';
import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyAhPbcvZF2JVgB4PWDFp9XCNo3v4pEhIh0",
  authDomain: "workout-timer-8a62d.firebaseapp.com",
  databaseURL: "https://workout-timer-8a62d.firebaseio.com",
  projectId: "workout-timer-8a62d",
  storageBucket: "workout-timer-8a62d.appspot.com",
  messagingSenderId: "732806782094"
};
firebase.initializeApp(config);

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{
      pageTransition: 'ios-transition'
    }),
    IonicStorageModule.forRoot(),
    HttpModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AppControllerProvider,
    Facebook,GooglePlus,Vibration
  ]
})
export class AppModule {}
