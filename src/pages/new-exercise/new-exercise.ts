import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides,AlertController } from 'ionic-angular';
import { AppControllerProvider } from '../../providers/app-controller/app-controller';
import { Exercises } from '../../providers/class/exercises';

/**
 * Generated class for the NewExercisePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface Items {
  icon: string;
  name: string;
  color: string;
}
@IonicPage()
@Component({
  selector: 'page-new-exercise',
  templateUrl: 'new-exercise.html',
})
export class NewExercisePage {
  @ViewChild(Slides) slide: Slides;
  items: Array<Items> = [];
  isLoading: boolean = true;
  exerciseFillter: Array<Exercises> = [];
  slides: Array<{ id: number, exerciseFillter: Array<Exercises> }> = [];
  exerciseSelected: Exercises;
  constructor(
    public mAlertController : AlertController,
    public appController: AppControllerProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.loadLanguage();
    this.items = [];
    this.loadItems();
    this.onLoadData();
  }
  language : any;
  loadLanguage(){
    this.language = this.appController.getLanguage().exercise;
  }

  goToFAQ(){
    this.navCtrl.push("FaqPage");
  }
  onLoadData() {
    this.exerciseFillter = [];
    this.slides = [];
    if (this.tabIndex == 2) {this.slides.push({id: 0,exerciseFillter: []}); return;}
    if (this.tabIndex == 0) this.exerciseFillter = this.appController.getCardioTemplate().filter(exercise => { return exercise });
    if (this.tabIndex == 1) this.exerciseFillter = this.appController.getYogaTemplate().filter(exercise => { return exercise });
    if (this.appController.exerciseStorage && this.appController.exerciseStorage.length > 0) {
      this.appController.exerciseStorage.forEach(element => {
        if (element.type == this.tabIndex + 1) {
          this.exerciseFillter.push(element);
        }
      });
    }
    console.log(this.exerciseFillter);
    this.exerciseSelected = this.exerciseFillter[0];
    var exercise = [];
    for (let i = 0; i < this.exerciseFillter.length; i++) {
      exercise.push(this.exerciseFillter[i]);
      if ((i + 1) % 5 == 0 || i == this.exerciseFillter.length - 1) {
        console.log(i);
        this.slides.push({ id: i, exerciseFillter: exercise });
        exercise = [];
      }
    }
  }


  loadItems() {
    this.items.push({ name: "Cardio", icon: "workout-icon-cardio", color: "#35EBBB" });
    this.items.push({ name: "Yoga", icon: "workout-icon-yoga", color: "#FFD65A" });
    this.items.push({ name: "Coming soon", icon: "workout-icon-question", color: "white" });
  }

  ionViewDidEnter() {
    this.onLoadData();
  }

  goToCreateExercise() {
    this.navCtrl.push("CreateExercisePage");
  }

  startWorkout() {
    this.navCtrl.push("WorkoutPlayPage", { exercise: this.exerciseSelected});
  }

  exerciseIndex: number = 0;
  selectExercise(item) {
    this.exerciseSelected = item;
    // this.exerciseIndex = i;
  }
  tabIndex: number = 0;
  selectTab(i) {
    this.tabIndex = i;
    this.onLoadData();
  }

  translate(number) {
    let element: HTMLElement = document.getElementById("animateBar");
    this.slide.slideTo(number);
    if (element) {
      var distance = element.clientWidth + 2;
      element.style.left = distance * number + "px";
    }
  }

  change() {
    let index = this.slide.getActiveIndex();
    if(index == this.slides.length )return;
    this.translate(index);
  }

  deleteExercise(){
    let alert = this.mAlertController.create({
      message: this.language.question +": "+ this.exerciseSelected.name + "?",
      title: this.language.deleteTitle,
      buttons : [
        {
          text: this.language.cancel
        },
        {
          text: this.language.delete,
          handler: ()=>{
            this.appController.showLoading();
            this.appController.deleteExercise(this.exerciseSelected).then((sucess)=>{
              this.onLoadData();
              this.slide.slideTo(this.slides.length -1);
              this.appController.hideLoading();
              this.appController.showToast(sucess);
            }).catch((err)=>{
              this.appController.showToast(err);
              this.appController.hideLoading();
            });
          }
        }
      ]
    })
    alert.present();
  }
}
