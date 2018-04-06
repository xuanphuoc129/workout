import { Component, ViewChild } from '@angular/core';
import { NavController, Slides, Slide } from 'ionic-angular';
import { AppControllerProvider } from '../../providers/app-controller/app-controller';
import { Exercises } from '../../providers/class/exercises';
import { Calendar, Day } from '../../providers/class/calendar';
import { Untils } from '../../providers/untils';
import { Users } from '../../providers/class/user';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild("month") month: Slides;
  @ViewChild("exercise") exercise: Slides;
  today: Date;
  dayofweeks: Array<string> = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  calendar: Calendar;
  selectedRow: number;
  isLoading: boolean = true;
  dayFillters: Array<Day> = [];
  calendars: Array<Calendar> = [];
  exerciseFillter: Array<Exercises> = [];
  exerciseIndex: number = 2;
  calendarIndex: number = 2;
  slides: Array<{ id: number, exercise: Array<Exercises> }> = [];
  todayString: string = "";
  selectedDay: Day;
  language: any;
  user: Users;

  constructor(
    public appController: AppControllerProvider,
    public navCtrl: NavController) {
    this.user = new Users();
    if(this.appController.user)this.user = this.appController.user;
    this.selectedDay = new Day();
    this.slides = [];
    this.today = new Date();
    this.todayString = Untils.createDateString(this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate());
    this.calendar = new Calendar();
    this.loadLanguage();
  }

  loadLanguage(){
    this.language = this.appController.getLanguage().home;
    this.dayofweeks = this.language.dayofweek;
  }


  ionViewDidLoad() {
    this.appController.clearAllData();
    this.load3Calendars();
    if(this.slides.length >0)this.translateAnimateBar(this.slides.length-1);
    this.appController.loadedDataChanel.asObservable().subscribe(()=>{
      this.loadLanguage();
    })
  }
  top: string = "7px";
  load3Calendars() {
    this.calendars.push(this.appController.calendar[this.today.getMonth() - 2]);
    this.calendars.push(this.appController.calendar[this.today.getMonth() - 1]);
    this.calendars.push(this.appController.calendar[this.today.getMonth()]);
    this.calendars[2].days.forEach((day,index) => {
      if (day != null && day.id == this.todayString) {
        this.selectedDay = day;
        this.top = Math.floor(index / 7) * 34 + 7 + "px";
        return;
      }

    })
    this.loadExerciseDone();
    // console.log(this.calendars);
  }

  selectDay(item: Day) {
    if(!item)return;
    this.selectedDay = item;
    this.loadExerciseDone();    
    this.translateAnimateBar(0);
  }

  selectedCalendar(i) {
    this.calendarIndex = i;
  }
  loadExerciseDone() {
    this.slides = [];
    var exercise = [];
    var dem = 0;
    if (!this.selectedDay.isWorkout){
      this.slides.push({id: 0,exercise: []});
      return;
    }
    for (let index = this.selectedDay.diary.exercises.length -1; index >=0; index--) {
      exercise.push(this.selectedDay.diary.exercises[index]);
      dem++;
      if (dem ==3 || index == 0) {
        this.slides.push({ id: index, exercise: exercise });
        if(this.slides.length==3)break;
        exercise = [];
        dem=0;
      }
    }
    this.slides.reverse();
    // console.log(this.selectedDay.diary.exercises);
    
    // if(this.exercise && this.slides.length > 0)this.exercise.slideTo(this.slides.length);
  }

    goToNewExercise() {
      this.navCtrl.push("NewExercisePage");
    }

    goToSetting() {
      this.navCtrl.push("SettingPage");
    }
    selectExercise(i) {
      this.exerciseIndex = i;
    }
    monthSelected: number = 2;
    translate(number) {
      if (number > 2) return;
      this.month.slideTo(number);
      this.monthSelected = number;
      let element = document.getElementById("monthAnimate");
      if (element) {
        let distance = element.clientWidth + 2;
        element.style.left = distance * number + "px";
      }
    }
    animateBarSelected: number = 2;
    translateAnimateBar(number) {
      this.animateBarSelected = number;
      if (this.exercise) this.exercise.slideTo(number)
      let element = document.getElementById("homeBar");
      if (element) {
        let distance = element.clientWidth + 2;
        element.style.left = (distance * number) + "px";
      }
    }

    change(type) {
      var index: number = 0;
      if (type == 1) {
        index = this.month.getActiveIndex();
        this.translate(index);
      } else {
        index = this.exercise.getActiveIndex();
        // console.log(index);
        if(index > this.slides.length - 1)return;
        this.translateAnimateBar(index);
      }
    }
  }
