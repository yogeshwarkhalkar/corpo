/*Component to trigger Event on clicking Add from Event list*/

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { UrlserviceService } from '../../services/urlservice.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
	addeventForm: FormGroup;
	processes: any;
	company:any;
  baseurl:string = this.url.BASE_URL;

  constructor(private http: HttpClient, private router: Router, private actRoute: ActivatedRoute, private fb: FormBuilder,
    private url: UrlserviceService, private cookie: CookieService) {
  	actRoute.params.subscribe(param=>{
  		this.company = param['company'];
  	})
   }

  ngOnInit() {
  	this.http.get(this.baseurl+'company/getProcess').subscribe(res=>{
  		this.processes = res;
  	},
  	(err: HttpErrorResponse)=>{
  		console.log(err);
  	})


  }

  getActivity(id){
    localStorage.removeItem('bmId');
    localStorage.removeItem('eventId');
    this.cookie.remove('meetingSerial');
    this.http.get(this.baseurl+'workflow/getActivity/'+id).subscribe(res=>{
    if(res){
      let activityid=res['activity']
      let data = {
        company:this.company,
        process:id,
        steps:activityid,
        status:'open'
      }
      this.http.post(this.baseurl+'workflow/storeEvent',JSON.stringify(data)).subscribe(res1=>{
          console.log(res1);
          localStorage.setItem('eventId',res1['id']);          
           this.http.get(this.baseurl+'workflow/getallactivity/'+id+'/'
            +res1['id']).subscribe(res=>{
            console.log(res);
          })  
          this.router.navigateByUrl('/activity/'+this.company+'/'+id+'/'+activityid)
      });
    
   }
   else{
    this.router.navigateByUrl('/dashboard') 
   }
  })

  }
}
