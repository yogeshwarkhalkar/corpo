/*Dashboard component*/

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NavbarService } from '../../services/navbar.service';
import { UrlserviceService } from '../../services/urlservice.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient, private auth: AuthService, private nav: NavbarService,
    private url:UrlserviceService, private router:Router, private cookie: CookieService) { }
  
  data: any;
  item: any;
  director: any;
  shareholder: any;
  userid: any;
  meetings:any;
  events:any;
  baseurl:string=this.url.BASE_URL;
  ngOnInit(): void{
    this.nav.hideLogin();
    this.nav.show();
    this.userid = this.cookie.get('userid');
    let header = new HttpHeaders().set('Content-Type', 'application/json');
  //header.append('Content-type', 'application/json');
  	this.http.get(this.baseurl+'company/company_api/'+this.userid).subscribe(result=>{
  		this.data = result;
  	});

    this.http.get(this.baseurl+'workflow/meetingCount/'+this.userid).subscribe(res=>{
      this.meetings = res;
      //console.log(this.meetings);
    })

    this.http.get(this.baseurl+'workflow/eventCount/'+this.userid).subscribe(res=>{
      this.events= res;
      //console.log(this.events);
    })
  	
  }

  
  details(detail): void{
  	this.item = detail;
  	
  }
  directors(ds): void{
  	this.http.get(this.baseurl+'company/company_stakeholder/'+ds+'/director').subscribe(result=>{
  		this.director = result;
  	})
  	  }

  shareholders(sh): void{
  	this.http.get(this.baseurl+'company/company_stakeholder/'+sh+'/shareholder').subscribe(result=>{
  		this.shareholder = result;
  		
  	})
  }

addBM(company){
  localStorage.removeItem('bmId');
  this.cookie.remove('meetingSerial');

  let data = {
        company:company,
        process:2,
        status:'open'
      }
  this.http.post(this.baseurl+'workflow/storeEvent',JSON.stringify(data)).subscribe(res=>{
          console.log(res);
          localStorage.setItem('eventId',res['id']);
          let bmurl = "/activity/"+company+"/2/29"
          this.http.get(this.baseurl+'workflow/getallactivity/2/'
            +res['id']).subscribe(res=>{
            console.log(res);
          })  
          this.router.navigateByUrl(bmurl);
      });
}
  
logout() {
  this.auth.logout()
}  

}
