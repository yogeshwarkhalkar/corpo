/*Servics file for Authentication (register, login, logout, reset password)*/

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { Register } from '../models/register';
import { NavbarService } from '../services/navbar.service';
import { UrlserviceService } from '../services/urlservice.service';
import { CookieService } from 'ngx-cookie';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {


  constructor( private http: HttpClient, private router: Router, private nav: NavbarService,
   private url: UrlserviceService, private cookie: CookieService) { }
  
  baseurl:string = this.url.BASE_URL;

  login(user): Promise<any>{
    let param = new HttpParams();
    param = param.append('email',user.email);
    param = param.append('password',user.password);
    const header = new Headers();
    header.append('Content-type', 'application/json');
     
  	return this.http.post(this.baseurl+'user/login', JSON.stringify(user),{params:param}).toPromise();
  }

  register(register): Promise<any> {
    return this.http.post(this.baseurl+'user/register',JSON.stringify(register)).toPromise();
  }


  resetPassword(email:string){
    console.log(email);
    return this.http.get(this.baseurl+'user/request_reset_password?useremail='+email);
  }
  logout() {
    this.http.get(this.baseurl+'user/logout').subscribe(res=>{
      console.log(res);
    },
    (err: HttpErrorResponse)=>{
      console.log(err);
    });
  //localStorage.clear();
  this.cookie.remove('userid');
  this.cookie.remove('session_id');
  this.cookie.remove('token');

  this.nav.hide();
  this.nav.showLogin();
  this.router.navigateByUrl('/login');
}  

}
