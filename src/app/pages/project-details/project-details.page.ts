import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import {map, debounceTime, distinctUntilChanged} from 'rxjs/operators';
import { Location } from '@angular/common';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/htmlmixed/htmlmixed';
import { ProjectDetailSettingsComponent } from 'src/app/components/project-detail-settings/project-detail-settings.component';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
export class ProjectDetailsPage implements OnInit {

  id = '';
  name = '';
  description = '';
  content = '';
  contentChanged: Subject<string> = new Subject<string>();
  loader: HTMLIonLoadingElement;
  sliderOpts = {
    slidesPerView: 1,
    pager: false
  };
  @ViewChild('slider', null) slider: any;

  constructor(
    public loadingCtrl: LoadingController,
    public modalController: ModalController,
    public userService: UserService,
    public toastController: ToastController,
    public projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {

    // Debounce for preview
    this.contentChanged.pipe(
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe(content => {
        // this.content = content;
        this.changeIframe();
      });
  }


  moveTo(slide) {
    this.slider.lockSwipes(false);
    this.slider.slideTo(slide);
    this.slider.lockSwipes(true);
  }
  ngOnInit() {
    this.showLoader().then(() => {
      this.slider.lockSwipes(true);
      this.route.params
      .pipe(map(p => p.id))
      .subscribe(async (id) => {
        this.id = id;
        if (this.id !== 'new') {
          const projectInfo: any = await this.projectService.getProjectInfo(id)
            .catch(async (err) => {
              if (this.loader) { await this.hideLoader(); }
              this.router.navigate(['/dashboard'], {queryParams: {error: 'Error loading project'}});
            });
          this.name = projectInfo.project_name;
          this.description = projectInfo.project_description;
          this.content = projectInfo.data;
        } else {
          this.name = 'New project';
          this.description = 'Nice project';
          // tslint:disable-next-line: max-line-length
          this.content = '<!DOCTYPE html>\n<html>\n<head>\n  <title>Page title</title>\n</head>\n  <body>\n    Hello world\n  </body>\n</html>';
        }
        this.changeIframe();
        if (this.loader) { await this.hideLoader(); }
      });
    });
  }

  changeIframe = () => {
    const iframe = document.getElementById('preview') as HTMLIFrameElement;

    console.log(this.content);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(this.content);
    iframe.contentWindow.document.close();

  }
  changed = (text: string) => {
    this.content = text;
    this.contentChanged.next(text);
  }

  copyToClipboard = () => {
    return `${environment.apiUrl}/projects/${this.id}`;
  }

  notify = (event) => {
    this.toastController.create({
      message: 'Copied to clipboard',
      duration: 2000,
      color: 'light',
      buttons: [
        {
          text: 'Close',
          role: 'cancel'
        }
      ]
    })
    .then((toast)=> {
      toast.present();
    });
  }

  showLoader = async () => {
    this.loader = await this.loadingCtrl.create({
        cssClass: 'custom-loader',
        spinner: null
    });
    await this.loader.present();
    setTimeout(this.hideLoader, 5000);
  }

  hideLoader = async () => {
    if (this.loader) {
      await this.loader.dismiss();
    }
  }

  saveTemplate = () => {
    this.showLoader();
    if (this.id === 'new') {
      // Create a new project
      this.projectService.createProject(this.name, this.description, this.content)
        .then(async (projectId: string) => {
          this.id = projectId;
          this.location.replaceState(`/project/${projectId}`);
          await this.hideLoader();
          this.toastController.create({
            message: 'Project created',
            duration: 2000,
            color: 'light',
            buttons: [
              {
                text: 'Close',
                role: 'cancel'
              }
            ]
          })
          .then((toast) => {
            toast.present();
          });
        })
        .catch(async (err) => {
          await this.hideLoader();
          this.toastController.create({
            message: 'Error saving project',
            duration: 2000,
            color: 'light',
            buttons: [
              {
                text: 'Close',
                role: 'cancel'
              }
            ]
          })
          .then((toast) => {
            toast.present();
          });
        });
    } else {
      // Save the current project
      this.projectService.updateProject(this.name, this.description, this.content, this.id)
      .then(async (projectId: string) => {
        await this.hideLoader();
        this.toastController.create({
          message: 'All changes saved',
          duration: 2000,
          color: 'light',
          buttons: [
            {
              text: 'Close',
              role: 'cancel'
            }
          ]
        })
        .then((toast) => {
          toast.present();
        });
      })
      .catch(async (err) => {
        await this.hideLoader();
        this.toastController.create({
          message: 'Error saving project',
          duration: 2000,
          color: 'light',
          buttons: [
            {
              text: 'Close',
              role: 'cancel'
            }
          ]
        })
        .then((toast) => {
          toast.present();
        });
      });
    }
  }


  openDialog = async () => {
    const modal = await this.modalController.create({
      component: ProjectDetailSettingsComponent,
      componentProps: {
        data: {name: this.name, description: this.description}
      }
    });

    await modal.present();
    const {data}: any = await modal.onWillDismiss();
    console.log(data);
    if (data) {
      this.name = data.name;
      this.description = data.description;
    }
    /*
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.description = result;

      console.log(this.description);
    });
    */
  }
}
