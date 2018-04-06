import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content,AlertController } from 'ionic-angular';
import { Exercises } from '../../providers/class/exercises';
import { AppControllerProvider } from '../../providers/app-controller/app-controller';
import { Events } from 'ionic-angular';
import { WorkOut } from '../../providers/class/counttime';
import { Untils } from '../../providers/untils';
import { Vibration } from '@ionic-native/vibration';

/**
 * Generated class for the WorkoutPlayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-workout-play',
  templateUrl: 'workout-play.html',
})
export class WorkoutPlayPage {
  @ViewChild(Content) content: Content;
  exercise: Exercises;
  workout: WorkOut;

  constructor(
    public mAlertController : AlertController,
    private vibration: Vibration,
    public appController: AppControllerProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.exercise = new Exercises();
    this.loadLanguage();
    if (navParams.data["exercise"]) this.exercise = navParams.get("exercise");
    console.log(this.exercise);

    this.workout = new WorkOut(this.exercise.timer);
    this.workout.setExercise(this.exercise);
    this.workout.set = this.exercise.getTotalExercise();
    this.workout.setTiming(this.workout.work);
    this.workout.callback = (data) => {
      console.log(data);
      if (data == -1 && this.appController.user.notification.sound) {
        this.playWork();
        return;
      }
      if (data == 2 && this.appController.user.notification.sound) {
        this.playRestAndBreak();
        return;
      }
      if(data == "done"){
        this.done();
      }
    }
  }
  language: any;
  loadLanguage() {
    this.language = this.appController.getLanguage().workout;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkoutPlayPage');
    // this.appController.loadAudio('assets/audio/td_ding.ogg');
  }
  ionViewWillLeave() {
    this.workout.stopCountTime();
  }

  
  closeBack(){
    this.workout.stopCountTime();
    let alert = this.mAlertController.create({
      message: this.language.message,
      buttons: [
        {
          text: this.language.cancel
        },
        {
          text: this.language.ok,
          handler: ()=>{
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  isPlay: boolean = false;
  timeout: any;
  timerInter: any;
  playAndPause() {
    this.workout.isRunning = !this.workout.isRunning;
    if (this.workout.isRunning) {
      if (this.workout.type == 0) {
        this.workout.runDelay();
      } else {
        this.workout.startCountTime();
      }
    } else {
      this.workout.stopCountTime();
    }
  }

  done() {
    var today = new Date();
    var dateString = Untils.createDateString(today.getFullYear(), today.getMonth() + 1, today.getDate());
    this.appController.addExerciseDoneToDiary(dateString, this.exercise).then(() => {
      console.log(this.exercise);

      this.navCtrl.setRoot("DoneWorkoutPage", { exercise: this.exercise });
    }).catch(err => {
      console.log("error");

    });
  }

  playTick() {
    this.appController.loadAudio("./assets/audio/tick.mp3");
    this.appController.playAudio();
  }

  playWork() {
    this.appController.loadAudio("./assets/audio/whistle.wav");
    this.appController.playAudio();
  }

  playRestAndBreak() {
    if(this.appController.user.notification.vibration)this.vibration.vibrate(1000);
    this.appController.loadAudio("./assets/audio/td_ding.mp3");
    this.appController.playAudio();
  }

}
