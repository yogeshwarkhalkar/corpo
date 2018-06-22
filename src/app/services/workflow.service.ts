/* Services for workflow component */

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
  


/* Get the activity data */
  getActivity(process, activity):Observable<any>{
    let header = new HttpHeaders();
  header.append('Content-type', 'application/json');
  	return this.http.get(this.baseurl+'workflow/getActivity/'+process+'/'+activity,{headers:header});
  }

/* Get the first activity data*/
  getFirstActivity(process):Observable<any>{
  	return this.http.get(this.baseurl+'workflow/getFirstActivity/'+process)
  }

/* Get the next activity based on previous activity*/
  getNextActivity(processId, activityId, next, data):Observable<any>{
  	return this.http.post(this.baseurl+'workflow/getActivity/'+processId+'/'+activityId+'/'+next, 
				JSON.stringify(data))
  }

/* Get the next process if current process is completed*/
  getNextProcess(next):Observable<any>{
  	return this.http.get(this.baseurl+'workflow/getActivity/'+next)
  }


/* Upload Agenda documents */
  uploadAgendaDoc(id,name, formdata):Observable<any>{
  	return this.http.post(this.baseurl+'workflow/uploadAgendaDoc/'+id+'/'+name,formdata)
  }

  getDirector(){}

  getStakeholder(){}

  getShareholder(){}


/* Get Board meeting details using id*/
  getBoardMeeting(bmid):Observable<any>{
  	return this.http.get(this.baseurl+'workflow/getMeeting/'+bmid)
  }

/* Store meeting data */
  storeMeeting(data):Observable<any>{
  	return this.http.post(this.baseurl+'workflow/storeMeeting',JSON.stringify(data))
  }


/* Generate Agenda documents */
  generateAgenda(data):Observable<any>{
  	return this.http.post(this.baseurl+'workflow/generateAgenda',JSON.stringify(data),
					{responseType:'blob',
					headers:new HttpHeaders().append('Content-Type', 'text/plain; charset=utf-8')})

  }

/* Get all previously uploaded resolutions*/
  getPreviousResolution(bmid):Observable<any>{
  	return this.http.get(this.baseurl+'workflow/uploadResolution/'+bmid)
  }

/* Get Company details*/
  getCompany(company):Observable<any>{
  	return this.http.get(this.baseurl+'company/getCompany/'+company)
  }

/* Get All agenda*/
  getAgenda():Observable<any>{
  	return this.http.get(this.baseurl+'workflow/getAgenda')
  }

/* Get All agenda*/
  getProcessAgenda(process):Observable<any>{
    return this.http.get(this.baseurl+'workflow/getAgenda/'+process)
  }

/* Get all workfliow steps*/
  getWorkflowSteps(eventId):Observable<any>{
  	return this.http.get(this.baseurl+'workflow/workflowSteps/'+eventId)
  }


/* Store process Activity status and data on completion */
  storeProcessActivity(eventId,activityId,data):Observable<any>{
  	return this.http.post(this.baseurl+'workflow/storeProcessActivity/'+eventId+'/'+activityId,
			JSON.stringify(data))
  }

/* Update activity status to ongoing */
  updateProcessActivity(eventId,activityId):Observable<any>{
    return this.http.get(this.baseurl+'workflow/storeProcessActivity/'+eventId+'/'+activityId)

  }

  sendOfferLetter(id,company):Observable<any>{
    return this.http.get(this.baseurl+'workflow/sendOfferLetter/'+id+'/'+company)
  }

}
