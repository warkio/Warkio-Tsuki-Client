import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { User } from '../interfaces/interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {

  }

  login(username: string, password: string ) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      this.http.post(`${environment.apiUrl}/users/login`, formData)
      .subscribe((res: User) => {
          console.log(res);
          if (res.token) {
              this.setSession(res);
              resolve();
          } else {
              reject();
          }
      }, err => { console.log(err); reject(); } );
    });

  }

  register(username: string, email: string, password: string ) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      this.http.post(`${environment.apiUrl}/users/register`, formData)
      .subscribe((res: User) => {
          console.log(res);
          if (res.token) {
              this.setSession(res);
              resolve();
          } else {
              reject();
          }
      }, err => { console.log(err); reject(); } );
    });
  }

  checkRegister() {
    return new Promise((resolve, reject) => {
      this.http.get(`${environment.apiUrl}/users/register-status`)
      .subscribe((res: any) => {
        resolve(res.enabled);
      }, err => { console.log(err); reject(); } );
    });
  }

  private setSession(authResult) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );

  }

  logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  getUserInfo() {
    return new Promise((resolve) => {
      this.http.get(`${environment.apiUrl}/users/info`)
      .subscribe((res: any) => {
          resolve(true);
      }, err => { resolve(false); } );
    });
  }
}
