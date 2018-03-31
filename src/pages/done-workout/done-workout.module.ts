import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DoneWorkoutPage } from './done-workout';

@NgModule({
  declarations: [
    DoneWorkoutPage,
  ],
  imports: [
    IonicPageModule.forChild(DoneWorkoutPage),
  ],
})
export class DoneWorkoutPageModule {}
