import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewExercisePage } from './new-exercise';

@NgModule({
  declarations: [
    NewExercisePage,
  ],
  imports: [
    IonicPageModule.forChild(NewExercisePage),
  ],
})
export class NewExercisePageModule {}
