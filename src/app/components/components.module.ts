import { NgModule } from '@angular/core';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ProjectDetailSettingsComponent } from './project-detail-settings/project-detail-settings.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [ToolbarComponent, ProjectDetailSettingsComponent],
  entryComponents: [],
  imports: [
    FormsModule,
    IonicModule,
    CommonModule
  ],
  exports: [ToolbarComponent, ProjectDetailSettingsComponent]
})
export class ComponentsModule { }
