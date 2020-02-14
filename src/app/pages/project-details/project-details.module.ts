import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectDetailsPageRoutingModule } from './project-details-routing.module';

import { ProjectDetailsPage } from './project-details.page';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ComponentsModule } from 'src/app/components/components.module';
import { CopyClipboardModule } from 'src/app/directives/copy-clipboard.module';
import { ProjectDetailSettingsComponent } from 'src/app/components/project-detail-settings/project-detail-settings.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    CopyClipboardModule,
    FormsModule,
    IonicModule,
    ProjectDetailsPageRoutingModule,
    CodemirrorModule
  ],
  entryComponents: [ProjectDetailSettingsComponent],
  declarations: [ProjectDetailsPage]
})
export class ProjectDetailsPageModule {}
