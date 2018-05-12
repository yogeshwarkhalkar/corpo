import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlserviceService } from '../../../services/urlservice.service';

@Component({
  selector: 'app-workflow-log',
  templateUrl: './workflow-log.component.html',
  styleUrls: ['./workflow-log.component.css']
})


export class WorkflowLogComponent implements OnInit {

 workflowData: any;


  constructor(private http: HttpClient, private url:UrlserviceService) { }
  baseurl:string=this.url.BASE_URL;
  ngOnInit() {

  	this.http.get(this.baseurl+'workflow/company_process/3').subscribe(res=>{
  		this.workflowData = res;
  		console.log(this.workflowData);
  	})
  }

}
