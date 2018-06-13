/* Component to show all event(Workflow) log*/

import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlserviceService } from '../../../services/urlservice.service';
import { saveAs,Blob } from 'file-saver/FileSaver';
import { PagerService } from '../../../services/pager.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Select2OptionData } from 'ng4-select2';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.css']
})
export class EventLogComponent implements OnInit {
  company:any;
  status:any;
  pager: any = {};
  pagedItems: any[];
  searchText:string;
  eventData:any;	
  objectKeys = Object.keys;
  baseurl:string=this.url.BASE_URL;
  constructor(private http: HttpClient, private url:UrlserviceService, private cookie: CookieService,
  	private router: Router, private actRoute:ActivatedRoute, private pagerService: PagerService,private fb: FormBuilder) {
  	actRoute.params.subscribe(param=>{
      this.company = param['id'];
      this.status = param['status'];

    })
  }

  ngOnInit() {

  	this.http.get(this.baseurl+'workflow/storeEvent/'+this.company+'/'+this.status).subscribe(res=>{
      this.eventData = res;
      console.log(this.eventData);

      this.setPage(1);
    })
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.eventData.length, page);
    this.pagedItems = this.eventData.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  gotoMeeting(selectedId){
     this.http.get(this.baseurl+'workflow/storeMeeting/'+this.company+'/open/'+selectedId).subscribe(res=>{
       console.log(res);
       let route = '/meetinglog/'+this.company+'/'+res[0]['status'];
    this.router.navigate([route,{selected:selectedId}])

    })
    

  }

  goto(id){
    console.log(id);
    this.cookie.remove('meetingSerial');

    this.http.get(this.baseurl+'workflow/updateEvent/'+id).subscribe(res=>{
      let step = +res['steps'];
      let process = res['process'];
      localStorage.setItem('eventId',id);
      this.router.navigateByUrl('/activity/'+this.company+'/'+process+'/'+step);
    })
  }

  showFiles(name, files){
    this.http.get(this.baseurl+'workflow/uploadFilling/'+files,{responseType:'blob'}).subscribe(res=>{
      saveAs(res,name+'.docx')
    })
  }

}
