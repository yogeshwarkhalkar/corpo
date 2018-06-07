import { Injectable } from '@angular/core';
import { UrlserviceService } from '../services/urlservice.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie';


import 'rxjs/add/operator/toPromise';

@Injectable()
export class WorkflowService {
  

  constructor(private url: UrlserviceService, private http: HttpClient,private cookie:CookieService) { 
    
     }
  baseurl = this.url.BASE_URL;
  

  getActivity(process, activity):Observable<any>{
    let header = new HttpHeaders();
  header.append('Content-type', 'application/json');
  	return this.http.get(this.baseurl+'workflow/getActivity/'+process+'/'+activity,{headers:header});
  }

  getFirstActivity(process):Observable<any>{
  	return this.http.get(this.baseurl+'workflow/getFirstActivity/'+process)
  }

  getNextActivity(processId, activityId, next, data):Observable<any>{
  	return this.http.post(this.baseurl+'workflow/getActivity/'+processId+'/'+activityId+'/'+next, 
				JSON.stringify(data))
  }

  getNextProcess(next):Observable<any>{
  	return this.http.get(this.baseurl+'workflow/getActivity/'+next)
  }

  uploadAgendaDoc(id,name, formdata):Observable<any>{
  	return this.http.post(this.baseurl+'workflow/uploadAgendaDoc/'+id+'/'+name,formdata)
  }

  getDirector(){}

  getStakeholder(){}

  getShareholder(){}

  getBoardMeeting(bmid):Observable<any>{
  	return this.http.get(this.baseurl+'workflow/getMeeting/'+bmid)
  }

  storeMeeting(data):Observable<any>{
  	return this.http.post(this.baseurl+'workflow/storeMeeting',JSON.stringify(data))
  }


  generateAgenda(data):Observable<any>{
  	return this.http.post(this.baseurl+'workflow/generateAgenda',JSON.stringify(data),
					{responseType:'blob',
					headers:new HttpHeaders().append('Content-Type', 'text/plain; charset=utf-8')})

  }

  getPreviousResolution(bmid):Observable<any>{
  	return this.http.get(this.baseurl+'workflow/uploadResolution/'+bmid)
  }

  getCompany(company):Observable<any>{
  	return this.http.get(this.baseurl+'company/getCompany/'+company)
  }

  getAgenda():Observable<any>{
  	return this.http.get(this.baseurl+'workflow/getAgenda/agenda_table')
  }

  getWorkflowSteps(eventId):Observable<any>{
  	return this.http.get(this.baseurl+'workflow/workflowSteps/'+eventId)
  }


  storeProcessActivity(eventId,activityId,data):Observable<any>{
  	return this.http.post(this.baseurl+'workflow/storeProcessActivity/'+eventId+'/'+activityId,
			JSON.stringify(data))
  }

}
