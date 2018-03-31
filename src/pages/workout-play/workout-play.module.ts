import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkoutPlayPage } from './workout-play';

@NgModule({
  declarations: [
    WorkoutPlayPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkoutPlayPage),
  ],
})
export class WorkoutPlayPageModule {}
