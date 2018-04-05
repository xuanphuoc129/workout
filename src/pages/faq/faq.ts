import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppControllerProvider } from '../../providers/app-controller/app-controller';

/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {
  tabbars: Array<{ icon: string, name: string, color: string }> = [];
  selectedIndex: number = 0;
  constructor(
    private appController: AppControllerProvider,
    public navCtrl: NavController, public navParams: NavParams) {
    this.tabbars = [];
    this.loadTabbar();
    this.loadItems();
    this.comingsoon = "Coming soon";
  }
  comingsoon: string = "Coming soon";
  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');
    this.loadTabbar();
    this.comingsoon = this.appController.language.appcontroller.comingsoon;
  }

  loadTabbar() {
    this.tabbars = [
      { icon: "workout-icon-cardio", name: "Cardio", color: "#35EBBB" },
      { icon: "workout-icon-yoga", name: "Yoga", color: "#FFD65A" },
      { name: "Coming soon", icon: "workout-icon-question", color: "white" }];
  }
  selectTab(i) {
    this.selectedIndex = i;
    if(i< this.tabbars.length -1){
      this.loadItems();
    }
  }

  items: Array<{ id: string, question: string, answer: string, isOpen: boolean }> = [];
  faq: any;
  loadItems() {
    if (this.appController.getFAQ()) var data = this.appController.getFAQ();
    
    if (!data) {
      this.items = [
        { id: "acc1", question: "Section 1", answer: "Lorem 1", isOpen: false },
        { id: "acc2", isOpen: false, question: "Section 2", answer: "Lorem 2 ldkjaflsdjfalksfjalskdfjalksfjalksfjlaksjdflaksdjfalksdjfalksdjfalskfjalskdfjalskfjalskdjflaksjflaksfjlkasdjflaksdjflaksdjflaksjflkasfjkalsdf" },
        { id: "acc3", isOpen: false, question: "Section 3", answer: "Lorem 3" },
        { id: "acc4", isOpen: false, question: "Section 4", answer: "Lorem 4" },
        { id: "acc5", isOpen: false, question: "Section 5", answer: "Lorem 5" },
      ]
      return;
    }
    this.items = [];
    if (this.selectedIndex == 0) {
      data.cardio.forEach((element, index) => {
        element["id"] = "acc" + index;
        element["isOpen"] = false;
        this.items.push(element);
      });
      return;
    }
    if(this.selectedIndex == 1){
      data.yoga.forEach((element, index) => {
        element["id"] = "acc" + index;
        element["isOpen"] = false;
        this.items.push(element);
      });
      return;
    }

  }

  openAccording(item) {
    var element: HTMLElement = document.getElementById(item.id);
    if (element) {
      var panel = <HTMLElement>element.nextElementSibling;
      if (item.isOpen) {
        panel.style.maxHeight = "0";
        item.isOpen = false;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
        item.isOpen = true;
      }
      console.log(panel.getAttribute("style"));
    }
  }
}
