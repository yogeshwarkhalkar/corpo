/* Component to select company from list of companies */

import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import { NavbarService } from '../../services/navbar.service';
import { UrlserviceService } from '../../services/urlservice.service';
import {HttpClient} from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import {CompanyService} from '../../services/company.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  userid:any;
  data:any;
  companyId:any;
  companyForm:FormGroup;
  type:any;
  status:any;
  constructor(private http: HttpClient, private auth: AuthService, private nav: NavbarService,
    private url:UrlserviceService,private router: Router, private fb: FormBuilder,
     private actRoute: ActivatedRoute, private cookie:CookieService, private comp:CompanyService) { 
      this.actRoute.params.subscribe(param=>{
        this.type = param['type'];
        this.status = param['status'];
      })
  }
  baseurl = this.url.BASE_URL;
  ngOnInit() {

  	this.companyForm = this.fb.group({
  		companyName:[null,Validators.required]
  	});
  	this.userid = this.cookie.get('userid');
  	this.http.get(this.baseurl+'company/company_api/'+this.userid).subscribe(result=>{
  		this.data = result;
  	});
  }

  selectCompany(companyId){
  	this.companyId = companyId;
  }

  onSubmit(){
    if(!this.status && this.type == 'meeting'){
        let tempUrl = '/activity/'+this.companyId+'/2/29';
        this.router.navigateByUrl(tempUrl);
    }
    else if(!this.status && this.type == 'event'){
        let tempUrl = '/events/'+this.companyId;
        this.router.navigateByUrl(tempUrl);
    }
    else if(this.status == 'close' && this.type == 'meeting'){
       let tempUrl = '/meetinglog/'+this.companyId+'/'+'close';
        this.router.navigateByUrl(tempUrl); 
    }
    else if(this.status == 'open' && this.type == 'meeting'){
       let tempUrl = '/meetinglog/'+this.companyId+'/'+'open';
        this.router.navigateByUrl(tempUrl); 
    }
    else if(this.status == 'all' && this.type == 'meeting'){
       let tempUrl = '/meetinglog/'+this.companyId+'/'+'all';
        this.router.navigateByUrl(tempUrl); 
    }
    else if(this.status == 'close' && this.type == 'event'){
       let tempUrl = '/eventlog/'+this.companyId+'/'+'close';
        this.router.navigateByUrl(tempUrl); 
    }
    else if(this.status == 'open' && this.type == 'event'){
       let tempUrl = '/eventlog/'+this.companyId+'/'+'open';
        this.router.navigateByUrl(tempUrl); 
    }
    else if(this.status == 'all' && this.type == 'event'){
       let tempUrl = '/eventlog/'+this.companyId+'/'+'all';
        this.router.navigateByUrl(tempUrl); 
    }
    else if(this.type == 'company'){
      let tempUrl = '/createCompany2';
      localStorage.setItem('editCompany',this.companyId);
      this.comp.getData(this.companyId);
      this.router.navigateByUrl(tempUrl);             
    }
    else{
       this.router.navigateByUrl('/dashboard');  
    }
  }
}