import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Slides, ViewController } from 'ionic-angular';
import { AppControllerProvider } from '../../providers/app-controller/app-controller';
import { ScrollItems, ScrollOption } from '../../providers/scroll-controller';
import { Exercises, Exercise, Time } from '../../providers/class/exercises';
import { Items } from '../new-exercise/new-exercise';

/**
 * Generated class for the CreateExercisePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface Slide {
  id: number;
  slide: Array<Exercise>;
}
@IonicPage()
@Component({
  selector: 'page-create-exercise',
  templateUrl: 'create-exercise.html',
})
export class CreateExercisePage {
  @ViewChild(Slides) slideContainer: Slides;

  arrayNumber: Array<number> = [];
  formlist: Array<any> = [];
  isUp: boolean = false;
  // newExercise: Exercises;
  exerciseFillter: Array<Exercise> = [];
  slides: Array<Slide> = [];
  numberSelected: number = 0;
  name: string = "Exercise Name";
  time: Time;
  newExercise: Exercises;
  constructor(
    public mViewController: ViewController,
    public modal: ModalController,
    public appController: AppControllerProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.loadLanguage();
    this.loadItems();
    this.newExercise = new Exercises();
    this.time = new Time();
    this.name = "Exericse Name";
    if (navParams.data["type"]) {
      let type = navParams.get("type");
      if (type == 0) {
      }
    }
  }

  goToFAQ() {
    this.navCtrl.push("FaqPage");
  }

  language: any;
  loadLanguage() {
    this.language = this.appController.getLanguage().createexercise;
  }
  ionViewDidEnter() {
    this.isSetup = false;
  }
  ionViewDidLoad() {
    this.onLoadData();
    console.log('ionViewDidLoad CreateExercisePage');
    // if (this.formlist && this.formlist.length > 0) this.createEventListeners();
    // console.log("newexercse", this.newExercise);

  }
  // ======click button dell=====
  unCheckAll() {
    for (let i = 0; i < this.slides.length; i++) {
      let slide = this.slides[i];
      slide.slide.forEach(exercise => {
        if (exercise["isCheck"] == true) {
          exercise["isCheck"] = false;
        }
      })
    }
    this.numberSelected = 0;
    this.slideContainer.slideTo(0);
  }


  tabIndex: number = 0;
  selectTab(i) {
    this.tabIndex = i;
    this.onLoadData();
    if (this.slideContainer) this.slideContainer.slideTo(0);
    this.numberSelected = 0;
  }
  selecteExercise(item) {
    item.isCheck = !item.isCheck;
    if (item.isCheck) this.numberSelected++;
    if (!item.isCheck) this.numberSelected--;
  }
  isSetup: boolean = false;
  goToSetTime() {
    this.isSetup = true;
    let modal = this.modal.create("SetTimePage", { time: this.time, name: this.name });
    modal.present();
    modal.onDidDismiss(data => {
      this.appController.hideLoading();
      if (data) {
        this.name = data.name;
        this.time = data.time;
      }
    })
  }

  onLoadData() {
    if (this.tabIndex == 0) this.exerciseFillter = this.appController.getCardioExercise();
    if (this.tabIndex == 1) this.exerciseFillter = this.appController.getYogaExercise();
    this.exerciseFillter.forEach(exercise => {
      exercise["isCheck"] = false;
    });
    this.onLoadSlides();
  }

  onLoadSlides() {
    // console.log(this.exerciseFillter);
    this.slides = [];
    for (let i = 0; i < 6; i++) {
      var slide = this.exerciseFillter.filter((exercise, index) => {
        return index >= (i * 5) && index < (i * 5 + 5);
      })
      this.slides.push({ id: i, slide: slide });
    }
  }

  createExercise() {
    // this.appController.showLoading();
    // console.log("create exericse");
    if(this.numberSelected < 2)return;
    let today = new Date();
    this.newExercise.id = "#edit" + today.getTime();
    this.newExercise.type = this.tabIndex + 1;
    for (let index = 0; index < this.exerciseFillter.length; index++) {
      if (this.exerciseFillter[index]["isCheck"] == true) {
        this.newExercise.exerciseList.push(this.exerciseFillter[index]);
        this.newExercise.exerciseListIDs.push(this.exerciseFillter[index].id);
      }
    }
    this.newExercise.icon = "workout-icon-edit";
    // this.appController.showLoading();
    if (this.isSetup) {
      if (this.time && this.name) {
        this.newExercise.timer = this.time;
        this.newExercise.name = this.name;
        if (this.newExercise.timer.getTotalTime() == 0) {
          // this.appController.hideLoading();
          return;
        }
        this.appController.addExercisesToStorage(this.newExercise).then(() => {
          // this.appController.hideLoading();
          this.appController.showToast(this.language.createsucess);
          this.mViewController.dismiss(this.newExercise);
        }).catch(err => { });
      }
    } else {
      let modal = this.modal.create("SetTimePage", { time: this.time, name: this.name });
      modal.present();
      modal.onDidDismiss(data => {
        // this.appController.hideLoading();
        if (data) {
          this.newExercise.name = data.name;
          this.newExercise.timer = data.time;
          console.log(this.newExercise.timer.getTotalTime());
          console.log(data);

          if (this.newExercise.timer.getTotalTime() == 0) {
            // this.appController.hideLoading();
            this.appController.showToast("You must setup time more than Zero");
            this.isSetup = false;
            return;
          }
          this.appController.addExercisesToStorage(this.newExercise).then(() => {
            // this.appController.hideLoading();
            this.appController.showToast(this.language.createsucess);
            this.mViewController.dismiss(this.newExercise);
          }).catch(err => { });
        }
      })
    }


  }

  change() {
    var index = this.slideContainer.getActiveIndex();
    this.translate(index);
  }
  translate(number) {
    if (number > 5) return;
    let element: HTMLElement = document.getElementById("animateBar1");
    // console.log("element",element);
    this.slideContainer.slideTo(number);

    // let classElement = document.getElementsByClassName("bar");
    // console.log("classElement", classElement);

    // let animateBar = 
    if (element) {
      console.log("element width", element);
      var distance = element.clientWidth + 2;
      element.style.left = distance * number + "px";
    }
  }


  items: Array<Items> = [];

  loadItems() {
    this.items.push({ name: "Cardio", icon: "workout-icon-cardio", color: "#35EBBB" });
    this.items.push({ name: "Yoga", icon: "workout-icon-yoga", color: "#FFD65A" });
    this.items.push({ name: "Coming soon", icon: "workout-icon-question", color: "white" });
  }
}
