import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { ScrollOption, ScrollItems } from '../../providers/scroll-controller';
import { AppControllerProvider } from '../../providers/app-controller/app-controller';
import { Time } from '../../providers/class/exercises';

/**
 * Generated class for the SetTimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-set-time',
  templateUrl: 'set-time.html',
})
export class SetTimePage {
  exercise_name: string = "Exercise Name";
  numbers: Array<number> = [];
  numbersReps: Array<number> = [];
  middleNumber: Array<number> = [0, 0, 0, 0, 0, 0, 0,0,0];
  divIDs: Array<string> = ["scroll1", "scroll2", "scroll3", "scroll4", "scroll5", "scroll6", "scroll7", "scroll8","scroll9"];
  time: Time;
  constructor(
    public mAlertController: AlertController,
    public appController: AppControllerProvider,
    public mViewController: ViewController,
    public navCtrl: NavController, public navParams: NavParams) {
    this.time = new Time();
    for (let i = 0; i < 60; i++) {
      this.numbers.push(i);
      if (i > 0 && i < 21) this.numbersReps.push(i);
    }
    this.loadLanguage();
    if (navParams.data["time"]) this.time = navParams.get("time");
    if (navParams.data["name"]) this.exercise_name = navParams.get("name");
    if (this.exercise_name == "Exercise Name" && this.appController.user.language == 1){
      this.exercise_name = this.language.title;
    }
    this.mCenterIndexs[0] = Math.floor(this.time.work / 60);
    this.mCenterIndexs[1] = this.time.work - (Math.floor(this.time.work / 60) * 60);
    this.mCenterIndexs[2] = Math.floor(this.time.rest / 60);
    this.mCenterIndexs[3] = this.time.rest - (Math.floor(this.time.rest / 60) * 60);
    this.mCenterIndexs[4] = this.time.reps - 1;
    this.mCenterIndexs[5] = Math.floor(this.time.break / 60);
    this.mCenterIndexs[6] = this.time.break - (Math.floor(this.time.break / 60) * 60);
    this.mCenterIndexs[7] = Math.floor(this.time.delay / 60);
    this.mCenterIndexs[8] = this.time.delay - (Math.floor(this.time.delay / 60) * 60);
  }
  language :any;
  loadLanguage(){
    this.language = this.appController.getLanguage().settime;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SetTimePage');
    this.createEventListeners();
    this.goToTimeSetup();
  }

  closeView() {

    this.time.parse({
      work: this.numbers[this.mCenterIndexs[0]] * 60 + this.numbers[this.mCenterIndexs[1]],
      rest: this.numbers[this.mCenterIndexs[2]] * 60 + this.numbers[this.mCenterIndexs[3]],
      reps: this.numbersReps[this.mCenterIndexs[4]],
      break: this.numbers[this.mCenterIndexs[5]] * 60 + this.numbers[this.mCenterIndexs[6]],
      delay: this.numbers[this.mCenterIndexs[7]] * 60 + this.numbers[this.mCenterIndexs[8]]
    });
    console.log(this.time);

    this.mViewController.dismiss({ time: this.time, name: this.exercise_name });
  }

  mEventsCreated: boolean = false;
  mScrollItems: Array<ScrollItems> = [];
  mCenterIndexs: Array<number> = [0, 0, 0, 0, 0, 0, 0,0,0];
  createEventListeners() {
    if (this.mEventsCreated) return;
    this.mEventsCreated = true;
    for (let index = 0; index < this.divIDs.length; index++) {
      let scrollItem = new ScrollItems(this.divIDs[index]);
      scrollItem.createListener();
      this.mScrollItems.push(scrollItem);
      scrollItem.setScrollEndListener((scrollTop) => {
        if (this.getNumberOfScrollingByTouch() != 1) {
          this.mCenterIndexs[index] = scrollItem.getCurrentFocusElement(true);
          return;
        }
        let  number = this.numbers[this.mCenterIndexs[index]];
        this.scrollTop(number, index);
      });

      scrollItem.setCenterChangedListend((centerIndex) => {
        this.mCenterIndexs[index] = centerIndex;
        if (index != 4) this.middleNumber[index] = this.numbers[this.mCenterIndexs[index]];
        if (index == 4) this.middleNumber[index] = this.numbersReps[this.mCenterIndexs[index]];
      });
    }
  }

  goToTimeSetup() {
    var distance = this.mScrollItems[0].mItemHeight;
    this.divIDs.forEach((divId, index) => {
      if (index != 4) this.middleNumber[index] = this.numbers[this.mCenterIndexs[index]];
      if (index == 4) this.middleNumber[index] = this.numbersReps[this.mCenterIndexs[index]];
      let element = document.getElementById(divId);
      if (element) {
        element.scrollTop = this.mCenterIndexs[index] * distance;
      }
    })
  }
  getNumberOfScrollingByTouch() {
    let numberScroll = 0;
    for (let scroll of this.mScrollItems) {
      if (scroll.isScrollingByTouch()) numberScroll++;
    }
    return numberScroll;
  }

  scrollTop(numberValue, scrollItemsIndex) {
    let scrollOptions: ScrollOption = {
      alpha: 0.2,
      epsilon: 1,
      callback: () => { }
    };

    let index = this.numbers.findIndex(number => {
      return number == numberValue;
    })

    if (index > -1) {
      this.mCenterIndexs[scrollItemsIndex] = index;
      this.appController.scrollController.doScroll(this.divIDs[scrollItemsIndex], this.mScrollItems[scrollItemsIndex].getScrollOfItemIndex(this.mCenterIndexs[scrollItemsIndex]), scrollOptions);
    }
  }

  showPromt() {
    let alert = this.mAlertController.create({
      title: this.language.title,
      inputs: [
        {
          placeholder: this.language.placeholder,
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
            if (data.input && data.input.length > 0) this.exercise_name = data.input;
          }
        }
      ]
    })
    alert.present();
  }

}
