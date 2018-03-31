import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateExercisePage } from './create-exercise';

@NgModule({
  declarations: [
    CreateExercisePage,
  ],
  imports: [
    IonicPageModule.forChild(CreateExercisePage),
  ],
})
export class CreateExercisePageModule {}
