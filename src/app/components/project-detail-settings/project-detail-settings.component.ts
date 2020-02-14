import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-project-detail-settings',
  templateUrl: './project-detail-settings.component.html',
  styleUrls: ['./project-detail-settings.component.scss'],
})
export class ProjectDetailSettingsComponent implements OnInit {

  @Input() data: any;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {}

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      name: this.data.name,
      description: this.data.description
    });
  }

}
