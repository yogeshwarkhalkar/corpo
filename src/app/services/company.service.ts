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

  updateData(data){
    let newData: any[] =[];
    this.companyData.push(data);
    newData.push(data);
    console.log(this.companyData);
    
  this.http.post(this.baseurl+'company/updateComp/'+this.companyId,
      JSON.stringify(this.companyData)).subscribe(res=>{
      console.log(res);
      this.companyId = res;
      this.postStakeholders(newData);
    }) 
  } 

  postStakeholders(data){
  	
  	this.http.post(this.baseurl+'company/company_stakeholder/'+this.userId+'/'+this.companyId,
  		JSON.stringify(data)).subscribe(res=>{
  		console.log(res);
  	})
  } 
  	
  }