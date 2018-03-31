import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Exercises } from '../../providers/class/exercises';
import { AppControllerProvider } from '../../providers/app-controller/app-controller';

/**
 * Generated class for the DoneWorkoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-done-workout',
  templateUrl: 'done-workout.html',
})
export class DoneWorkoutPage {
  title: string = "Exercise Name";
  calories: number = 150;
  time: string = "255";
  work: number = 30;
  circle: number = 10;
  constructor(
    public appController: AppControllerProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.loadLanguage();
    if (navParams.data["exercise"]) {
      var exercise: Exercises = navParams.get("exercise");
      this.title = exercise.name;
      this.calories = Math.round(200 / 3600 * exercise.getTotalTime());
      this.time = exercise.getTotalTimeString();
      this.work = exercise.getTotalExercise();
      this.circle = exercise.timer.reps;
    }
  }
  language: any;
  loadLanguage() {
    this.language = this.appController.getLanguage().done;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoneWorkoutPage');
  }

  backToHome() {
    this.navCtrl.setRoot(HomePage);
  }
}
