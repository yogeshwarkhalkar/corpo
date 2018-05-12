import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class LoginRedirectService implements CanActivate{

  constructor(private auth: AuthService, private router: Router, private cookie: CookieService) { }
  canActivate(): boolean{
  	if(this.cookie.get('userid')){
  		this.router.navigateByUrl('/dashboard');
  		return false;
  	}
  	else{
  		return true;
  	}
  }

}
