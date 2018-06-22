/*Service file for add company,stakeholder & update company, stakeholder*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlserviceService } from '../services/urlservice.service';
import { CookieService } from 'ngx-cookie';

	
@Injectable()
export class CompanyService {


	
  constructor(private http: HttpClient, private url:UrlserviceService, private cookie:CookieService) { 
  }
    
  baseurl : string = this.url.BASE_URL;
  companyData: any[] = [];
  companyId: any;
  userId = this.cookie.get('userid');
  editCompanyData:any;

  getState(val){ 
    return this.http.get(this.baseurl+'company/getState/'+val).toPromise();
  }

  getCity(val){
    console.log(val);
  return this.http.get(this.baseurl+'company/getCity/'+val).toPromise();
  }
  
  getData(company){
    this.http.get(this.baseurl+'company/editCompany/'+company).toPromise()
      .then(res=>{
        console.log(res);
          this.editCompanyData = res;
      })
  }
  
  addData(data){
  	console.log(data);
  	this.companyData.push(data);
  	console.log(this.companyData);
    }

  storeData(data){
  	let newData: any[] =[];
  	this.companyData.push(data);
  	newData.push(data);
    console.log(newData);
  	// console.log(this.companyData);
  	
	this.http.post(this.baseurl+'company/createComp/'+this.userId,
  		JSON.stringify(this.companyData)).subscribe(res=>{
  		console.log(res);
  		this.companyId = res;
  		this.postStakeholders(newData);
  	}) 
  } 

 updateData(data,company){
    console.log(data);
    
  this.http.post(this.baseurl+'company/updateComp/'+company,
      JSON.stringify(data)).subscribe(res=>{
      console.log(res);
      this.companyId = res;
      // this.postStakeholders(newData);
    }) 
  } 

  postStakeholders(data){
  	
  	this.http.post(this.baseurl+'company/company_stakeholder/'+this.companyId,
  		JSON.stringify(data)).subscribe(res=>{
  		console.log(res);
  	})
  }
  updateStakeholder(data){
    this.http.post(this.baseurl+'company/updatestakeholder',
      JSON.stringify(data)).subscribe(res=>{
      console.log(res);
    })

  } 
  	
  }