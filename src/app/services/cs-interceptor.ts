/* Http Interceptor to intercept all incoming and outgoing request.
 Add Authorization token to all outgoing request */

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie';
import { NgProgress } from 'ngx-progressbar';
import { NavbarService } from '../services/navbar.service';
//import { AuthService } from '../services/auth.service';

@Injectable()
export class CsInterceptor implements HttpInterceptor {
  constructor(private cookie: CookieService, public progress: NgProgress, 
    private route: Router, private nav:NavbarService) {}
  token:any;
  errno:number=0;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = this.cookie.get('token');
         // console.log(request);
    if(this.token){
     request = request.clone({
      setHeaders: {       
        Authorization: `Bearer ${this.cookie.get('token')}`,
      }
    });
   }
     // console.log(request);
    return next.handle(request)
    
    .do((event: HttpEvent<any>)=>{
      if (event instanceof HttpResponse) {
        // console.log(event.body);
        // do stuff with response if you want
      }

      }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401 && this.errno == 0) {
          // redirect to the login route
          this.errno += 1;
          this.cookie.remove('userid');
          this.cookie.remove('session_id');
          this.cookie.remove('token');

          this.nav.hide();
          this.nav.showLogin();
          this.route.navigate(['/login', {_next: this.route.url}]);
         
        }
        if (err.status === 500) {
          alert('server error')
          // redirect to the login route
          // or show a modal
        }
      }
    });
  }
}


