import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetTimePage } from './set-time';

@NgModule({
  declarations: [
    SetTimePage,
  ],
  imports: [
    IonicPageModule.forChild(SetTimePage),
  ],
})
export class SetTimePageModule {}
