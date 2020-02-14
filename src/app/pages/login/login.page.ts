import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username = '';
  email = '';
  password = '';
  selectedField = 'login';
  private error: string = null;
  loader: HTMLIonLoadingElement;
  constructor(
    public loadingCtrl: LoadingController,
    public userService: UserService,
    public toastController: ToastController,
    private router: Router,
    public route: ActivatedRoute
    ) { }

  ngOnInit() {
    // this.showLoader();
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
    await this.loader.dismiss();
  }

  processChange() {
    if (this.selectedField === 'register') {
      this.showLoader();
      this.userService.checkRegister().then(async (res) => {
        if (!res) {
          const toast = await this.toastController.create({
            message: 'Register is currently disabled',
            duration: 2000,
            color: 'light',
            buttons: [
              {
                text: 'Close',
                role: 'cancel'
              }
            ]
          });
          toast.present();
          this.selectedField = 'login';
        }
        this.hideLoader();
      })
      .catch((err) => {
        this.hideLoader().then(async () => {
          const toast = await this.toastController.create({
            message: 'Error retrieving register status',
            duration: 2000,
            color: 'light',
            buttons: [
              {
                text: 'Close',
                role: 'cancel'
              }
            ]
          });
          toast.present();
        });
      });
    }
  }


  doLogin() {
    // Loading screen
    this.showLoader();
    this.userService.login(this.username, this.password).then((res) => {
      this.hideLoader().then( () => { this.router.navigate(['/dashboard']); });
    })
    .catch((err) => {
      this.hideLoader().then(async () => {
        const toast = await this.toastController.create({
          message: 'Login failed',
          duration: 2000,
          color: 'light',
          buttons: [
            {
              text: 'Close',
              role: 'cancel'
            }
          ]
        });
        toast.present();
      });
    });

  }

  doRegister() {
    // Loading screen
    this.showLoader();
    this.userService.register(this.username, this.email, this.password).then((res) => {
      this.hideLoader().then( () => { this.router.navigate(['/dashboard']); });
    })
    .catch((err) => {
      this.hideLoader().then(async () => {
        const toast = await this.toastController.create({
          message: 'Register failed',
          duration: 2000,
          color: 'light',
          buttons: [
            {
              text: 'Close',
              role: 'cancel'
            }
          ]
        });
        toast.present();
      });
    });
  }

  handleClick() {
    if (this.selectedField === 'login') {
      this.doLogin();
    } else {
      this.doRegister();
    }
  }

}
