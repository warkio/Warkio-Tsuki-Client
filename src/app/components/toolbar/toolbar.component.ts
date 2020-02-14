import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router,
    private menu: MenuController
  ){}

  ngOnInit() {
  }

  logoutClick() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }

  homeClick() {
    this.router.navigate(['/dashboard']);
  }
  openFirst() {
    this.menu.open('first');
  }

  closeFirst() {
    this.menu.close('first');
  }

}
