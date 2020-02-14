import { Component, OnInit } from '@angular/core';
import { Project, ProjectList } from 'src/app/interfaces/interfaces';
import { UserService } from 'src/app/services/user.service';
import { ProjectService } from 'src/app/services/project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {


  projects: Project[] = [];
  error: string = null;
  totalPages = 0;
  loader: HTMLIonLoadingElement;

  constructor(
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public toastController: ToastController,
    public projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.showLoader().then(()=> {
      // Get projects
      this.projectService.getProjects(1)
        .then(async (res: ProjectList) => {
          this.projects = res.result;
          this.totalPages = Math.floor(res.total / res.itemsPerPage);
          await this.hideLoader()
        })
        .catch(async (err) => {
          this.userService.logout();
          await this.hideLoader()
          this.router.navigate(['/login']);
        });

      // See if there's any error
      this.route.queryParams.subscribe(params => {
        this.error = params.error;
        if (this.error) {
          this.toastController.create({
            message: this.error,
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
        }
      });
    });

  }

  ngOnInit() {
  }

  deleteProject(projectId) {
    this.showLoader();
    this.projectService.deleteProject(projectId)
      .then(async () => {
        this.projects = this.projects.filter( p => p.project_identifier !== projectId);
        await this.hideLoader();
        this.toastController.create({
          message: 'Project deleted',
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
      })
      .catch(async (err) => {
        await this.hideLoader();
        this.toastController.create({
          message: 'Error deleting project',
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
      });
  }

  copyToClipboard = (id) => {
    return `${environment.apiUrl}/projects/${id}`;
  }

  notify(event) {
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
  }

  hideLoader = async () => {
    await this.loader.dismiss();
  }

}
