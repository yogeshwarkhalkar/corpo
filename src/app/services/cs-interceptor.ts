import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { NgProgress } from 'ngx-progressbar';

@Injectable()
export class CsInterceptor implements HttpInterceptor {
  constructor(private cookie: CookieService, public progress: NgProgress) {}
  token:any;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.token = this.cookie.get('session_id');
	  //request = request.clone({'body':{'session':this.token}})    
    //console.log(this.token,request);

    //send the newly created request
    
    return next.handle(request)
    .do(succ=>{
    /*.do((event: HttpEvent<any>)=>{
      if (event instanceof HttpResponse) {
        console.log(event.body);
        // do stuff with response if you want
      }

      }, (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          alert('error')
          // redirect to the login route
          // or show a modal
        }
        if (err.status === 500) {
          alert('server error')
          // redirect to the login route
          // or show a modal
        }
      }
    });*/

    	//console.log(succ, Response.arguments, Request.arguments)
      
    	if(succ['body']){

    		if(succ['body']['session'])
    			this.cookie.set('session_id',succ['body']['session']);
        if(succ['body']['cookies'])
          this.cookie.set('session_id_csautomation',succ['body']['cookies']);
      }

    }, err=> console.error(err));
	/*.catch((error, caught) => {
	//intercept the respons error and displace it to the console
	console.log(caught);
	console.log(error.message);
	//return the error to the method that called it
	return Observable.throw(error);
	}) as any;*/
  }
}