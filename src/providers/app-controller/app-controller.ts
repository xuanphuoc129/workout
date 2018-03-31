import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage';
import { KEYS } from '../app-constant';
import { Exercises, Exercise } from '../class/exercises';

import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';

import { Http } from "@angular/http"
import { Observer } from 'rxjs/Observer';
import { Calendar, Day } from '../class/calendar';
import { Diary } from '../class/diary';
import { Subscription } from 'rxjs/Subscription';
import { ScrollController } from '../scroll-controller';

import { Toast, ToastController, Loading, LoadingController } from "ionic-angular";
import { Untils } from '../untils';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';

import firebase from 'firebase';
import { Users } from '../class/user';
import { GooglePlus } from '@ionic-native/google-plus';
/*
  Generated class for the AppControllerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class AppControllerProvider {
  public cardioExercise: Array<Exercise> = [];
  public yogaExercise: Array<Exercise> = [];

  public cardioTemplate: Array<Exercises> = [];
  public yogaTemplate: Array<Exercises> = [];

  public calendar: Array<Calendar> = [];
  public diarys: Array<Diary> = [];

  loadedDataChanel: Subject<string> = new Subject<string>();
  exerciseCollection: Map<string, Exercises> = new Map<string, Exercises>();
  // exerciseDoneCollection: Map<string, Exercises> = new Map<string, Exercises>();/

  mDataJSON: any;
  loadDataSubscription: Subscription;

  scrollController: ScrollController;
  private mAudio: HTMLAudioElement;
  private loading: Loading;
  public loadedData = {
    dataFile: false,
    diary: false,
    calendar: false,
    exercise: false,
    user: false
  }

  today: Date;
  todayString: string = "";
  user: Users;
  language: any;
  constructor(
    private googlePlus: GooglePlus,
    private facebook: Facebook,
    public loadingCtrl: LoadingController,
    public mToastController: ToastController,
    private http: Http,
    private storage: Storage) {
    this.resetData();
    this.scrollController = new ScrollController();
    this.mAudio = new Audio("./assets/audio/td_ding.mp3");
    this.today = new Date();
    this.todayString = Untils.createDateString(this.today.getFullYear(), this.today.getMonth() + 1, this.today.getDate());
    this.user = new Users();
    this.fakeLanguage();
  }

  faq: any;
  getFAQ() {
    if (!this.mDataJSON) return;
    if (this.user.language == 1) return this.faq.vn;
    if (this.user.language == 2) return this.faq.es;
  }

  fakeLanguage() {
    this.language = {
      home: {
        title: "Today",
        dayofweek: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        today: "Today",
        checkday: "Check-day",
        monthago: "2 months ago",
        lastmonth: "Last month",
        thismonth: "This month",
        null: "Null",
        readyworkout: "Ready Workout"
      },
      settings: {
        title: "Setting",
        connect: "Connect",
        language: "Language",
        notifications: "Notifications",
        vibration: "Vibration",
        alarm: "Alarm",
        sound: "Sound",
        on: "On",
        off: "Off",
        physic: "Physic",
        height: "height",
        weight: "weight",
        bmi: "Your MBI result:"
      },
      exercise: {
        title: "Exercise",
        startworkout: "Start Workout",
        deleteTitle: "Delete Exercise",
        question: "Are you want to delete this exercise",
        cancel: "Cancel",
        delete: "Delete"
      },
      createexercise: {
        title: "Create Exercise",
        select: "Selected",
        create: "Create",
        createsucess: "Create exercise sucess"
      },
      settime: {
        title: "Exercise Name",
        work: "Work",
        rest: "Rest",
        reps: "Reps",
        break: "Break",
        delay: "Delay",
        placeholder: "Input name of exericse",
        cancel: "Cancel",
        ok: "Save",
        accept: "Accept"
      },
      workout: {
        set: "Set",
        reps: "Reps",
        total: "Total time",
        timenow: "Time now",
        start: "Start"
      },
      done: {
        caloburned: "Total Kcal",
        totaltime: "Total time",
        totalwork: "Total work",
        circle: "Circle",
        backtohome: "Back To Home"
      },
      appcontroller: {
        deletesucess: "Delete Exercise Sucess",
        deletefail: "You can't delete this exerics",
        facebooksucess: "Login facebook sucess",
        facebookfail: "Login facebook fail, Can't connect to serve",
        facebookerror: "Can't login facebook",
        googlesucess: "Login google sucess",
        googlefail: "Login google fail, Can't connect to serve",
        googleerror: "Can't login google",
        connected: "Connected"
      }
    }
  }

  getLanguage() {
    return this.language;
  }

  updateUser(user: Users): Promise<any> {
    this.user = user;
    return this.saveDataToStorage(KEYS.USER, this.user);
  }

  loadUser() {
    this.user = new Users();
    this.getDataFromStorage(KEYS.USER).then(data => {
      if (data) {
        this.user.parse(data);
      }
      this.loadedData.user = true;
      this.loadedDataChanel.next("user");
    }).catch(err => {
      this.loadedData.user = true;
      this.loadedDataChanel.next("user");
    });
  }

  loginWithFacebook(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.facebook.login(['email'])
        .then(res => {
          const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
          firebase.auth().signInWithCredential(facebookCredential).then(success => {
            this.user.facebook = success.displayName;
            this.updateUser(this.user);
            resolve(this.language.appcontroller.facebooksucess);
            // console.log(success);
          }, error => {
            resolve(this.language.appcontroller.facebookfail);
            // console.log(error);
          });
        })
        .catch(e => {
          reject(this.language.appcontroller.facebookerror);
        });
    })
  }

  loginWithGoogle(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.googlePlus.login({
        'webClientId': '732806782094-9r6tudu5lferc7mhesra0okq6vl07msq.apps.googleusercontent.com',
        'offline': true
      }).then(res => {
        let googleCredential = firebase.auth.GoogleAuthProvider.credential(res.idToken, res.accessToken);
        firebase.auth().signInWithCredential(googleCredential).then(success => {
          if (success.displayName) { this.user.google = success.displayName; }
          else { this.user.google = this.language.appcontroller.connected; }
          this.updateUser(this.user);
          resolve(this.language.appcontroller.googlesucess);
          // console.log(success);
        }, error => {
          reject(this.language.appcontroller.googlefail);
          // console.log(error);
        });
      }, error => {
        reject(this.language.appcontroller.googleerror);
      })
    })
  }

  loadAudio(src: string) {
    // if(src){this.mAudio.src = src;}
    this.mAudio.src = src;
  }
  playAudio() {
    if (this.mAudio.paused) {
      this.mAudio.play();
    }
  }
  stopAudio() {
    if (!this.mAudio.paused) {
      this.mAudio.pause();
    }
    this.mAudio.currentTime = 0;
  }

  loadCalendar(year: number) {
    if (year == 0) return;
    this.calendar = [];
    for (let i = 1; i < 13; i++) {
      let newCalendar = new Calendar(i, year);

      newCalendar.days.forEach(day => {
        if (this.diarys.length == 0 || day == null) return;
        this.diarys.forEach(diary => {
          if (day.id == diary.date) {
            day.diary = diary;
            day.isWorkout = true;
          }
        });
      })
      this.calendar.push(newCalendar);
    }
    this.loadedData.calendar = true;
    this.loadedDataChanel.next("calendar");
  }

  showToast(message, position?: any, duration?: any) {
    this.mToastController.create({
      message: message,
      position: position ? position : "bottom",
      duration: duration ? duration : 2000
    }).present();
  }

  showLoading(content?: string, cssClass?: string) {
    if (this.loading) {
      this.loading.dismiss();
    }
    var loading = "Xin đợi";
    if (this.user.language == 2) loading = "Please wait"
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: content ? content : loading,
      cssClass: cssClass ? cssClass : ""
    })
    this.loading.present();
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss().catch(() => {

      });
    }
  }


  getDay(dayNumber: number, month: number, year?: number): Day {
    var yearNumber = new Date().getFullYear();
    if (year) yearNumber = year;
    if (!this.calendar || this.calendar.length == 0) return new Day();
    var calendar = this.calendar[month - 1];
    let index = calendar.days.findIndex(elm => {
      return elm != null && elm.dayNumber == dayNumber;
    })
    if (index > -1) {
      return calendar.days[index];
    } else {
      return new Day();
    }
  }

  resetData() {
    this.cardioExercise = [];
    this.yogaExercise = [];
    this.cardioTemplate = [];
    this.yogaTemplate = [];
    this.diarys = [];
    this.exerciseStorage = [];
    this.calendar = [];
    this.exerciseCollection.clear();
    // this.exerciseDoneCollection.clear();
    this.loadedData = {
      dataFile: false,
      diary: false,
      calendar: false,
      exercise: false,
      user: false
    };
  }

  onLoadData() {
    this.loadUser();
    this.onLoadDataDiary();
    this.onLoadDataTemplate();
    this.onLoadDataExerciseFromStorage();
    // this.loadAudio("./assets/audio/td_ding.ogg");
    this.loadDataSubscription = this.loadedDataChanel.asObservable().subscribe(() => {

      if (this.loadedData.calendar) this.loadDataSubscription.unsubscribe();
      if (this.loadedData.exercise && this.loadedData.diary) {
        let today = new Date();
        this.loadCalendar(today.getFullYear());
        // this.exerciseCollection.forEach(value=>{
        //   console.log(value);
        // })        
      }
    })
  }

  /**Luu du lieu vao storage */
  saveDataToStorage(key: string, value): Promise<any> {
    return this.storage.set(key, value).then(() => {
      console.log("Save data to storage sucess");
    }).catch(err => {
      console.log("Save data to storage fail", err);
    })
  }

  /**Load du lieu tu storage */
  getDataFromStorage(key): Promise<any> {
    return this.storage.get(key);
  }

  /**Load du lieu tu file json */
  getDataFromJSON(link: string) {
    return this.http.get(link).map(res => res.json());
  }

  /**Lưu id bài tập vào nhật kí ngày tương ứng */
  addExerciseDoneToDiary(date: string, exercise: Exercises): Promise<any> {
    let index = this.diarys.findIndex(elm => {
      return elm.date == date;
    })
    console.log(this.diarys);
    console.log(index);

    if (index > -1) {
      this.diarys[index].exercises.push(exercise);
    } else {
      this.diarys.push(new Diary({ date: date, exercises: [exercise] }));
    }
    this.calendar[this.today.getMonth()].days.forEach(day => {
      if (day && day.id == date) {
        day.diary.exercises.push(exercise);
        day.isWorkout = true;
      }
    })
    return this.saveDataToStorage(KEYS.DIARY, this.diarys);
  }

  /**Load toan bo du lieu danh sach nhat ki */
  onLoadDataDiary() {
    this.diarys = [];
    this.getDataFromStorage(KEYS.DIARY).then(data => {
      if (data) {
        console.log("Diary", data);
        data.forEach(element => {
          this.diarys.push(new Diary(element));
        });
      }
      this.loadedData.diary = true;
      this.loadedDataChanel.next("diary");
    }).catch(err => {
      // console.log("Error in onLoadData", err);
      this.loadedData.diary = true;
      this.loadedDataChanel.next("diary");
    })
  }

  exerciseStorage: Array<Exercises> = [];
  /**Load danh sach bai tap nguoi dung tu tao*/
  onLoadDataExerciseFromStorage() {
    this.exerciseStorage = [];
    this.getDataFromStorage(KEYS.EXERCISE).then(data => {
      if (data) {
        data.forEach(element => {
          this.exerciseStorage.push(new Exercises(element));
        });
        this.exerciseStorage.forEach(exer => {
          this.exerciseCollection.set(exer.id, exer);
        })
      }
      this.loadedData.exercise = true;
      this.loadedDataChanel.next("storage");
    }).catch(err => {
      // console.log("Error in onLoadData", err);
      this.loadedData.exercise = true;
      this.loadedDataChanel.next("storage");
    })
  }

  /**Luu bai tap tu tao vao storage */
  addExercisesToStorage(exercise: Exercises): Promise<any> {
    this.exerciseStorage.push(exercise);
    return this.saveDataToStorage(KEYS.EXERCISE, this.exerciseStorage);
  }
  deleteExercise(exercise: Exercises): Promise<any> {
    return new Promise((resolve, reject) => {
      let index = this.exerciseStorage.findIndex(exe => {
        return exe.id == exercise.id;
      })
      if (index > -1) {
        this.exerciseStorage.splice(index, 1);
        this.exerciseCollection.delete(exercise.id);
        this.saveDataToStorage(KEYS.EXERCISE, this.exerciseStorage);
        resolve(this.language.appcontroller.deletesucess);
      }
      reject(this.language.appcontroller.deletefail);
    })

  }
  /**Load du lieu bai tap tu tao tu json */
  onLoadDataTemplate() {
    this.getDataFromJSON(KEYS.TEMPLATE).subscribe(
      data => {
        if (data) {
          // console.log("Data Template", data.template);
          this.mDataJSON = data;
          this.faq = this.mDataJSON.faq;
          this.language = this.mDataJSON.language.es;
          /**Do something here */
          if (data.exercise && data.exercise.cardio && data.exercise.yoga) {
            data.exercise.cardio.forEach(ex => {
              this.cardioExercise.push(new Exercise(ex));
            })
            data.exercise.yoga.forEach(ex => {
              this.yogaExercise.push(new Exercise(ex));
            })
          }
          // load template
          if (data.template && data.template.cardio && data.template.yoga) {
            data.template.cardio.forEach(temp => {
              this.cardioTemplate.push(new Exercises(temp));
            })
            console.log("cardio template", this.cardioTemplate);

            this.cardioTemplate.forEach(exer => {
              exer.exerciseList = this.onLoadExericse(exer.exerciseListIDs, 1);
            })
            data.template.yoga.forEach(temp => {
              this.yogaTemplate.push(new Exercises(temp));
            })
            console.log("yoga template", this.yogaTemplate);

            this.yogaTemplate.forEach(exer => {
              exer.exerciseList = this.onLoadExericse(exer.exerciseListIDs, 2);
            })
          }
        }
        this.loadedData.dataFile = true;
        this.loadedDataChanel.next("file");
      });
  }

  onLoadExericse(ids: Array<string>, type: number): Array<Exercise> {
    var result: Array<Exercise> = [];
    var data;
    if (type == 1) data = this.cardioExercise;
    if (type == 2) data = this.yogaExercise;
    ids.forEach(id => {
      var index = data.findIndex(exercise => {
        return id == exercise.id;
      })
      if (index > -1) {
        result.push(data[index]);
      }
    })
    return result;
  }

  getCardioTemplate() {
    return this.cardioTemplate;
  }

  getYogaTemplate() {
    return this.yogaTemplate;
  }

  getCardioExercise() {
    return this.cardioExercise;
  }

  getYogaExercise() {
    return this.yogaExercise;
  }
  /**Mapping du lieu thanh mang exercies */
  onMappingDataToExercises(data: any): Array<Exercises> {
    let result: Array<Exercises> = [];
    if (data && data.length > 0) {
      data.forEach(element => {
        result.push(new Exercises(element));
      });
    }
    return result;
  }

  clearAllData() {
    this.storage.clear();
  }

  convertSecondToMinutes(time: number) {
    let minute = Math.floor(time / 60);
    let second = time - (minute * 60);
    return (minute > 9 ? "" : "0") + minute + "'" + (second > 9 ? "" : "0") + second;
  }
}
