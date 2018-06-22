import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import {CompanyService} from '../../services/company.service';
import { HttpClient } from '@angular/common/http';
import { UrlserviceService } from '../../services/urlservice.service';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  @Input('address')
  addressForm: FormGroup;
  states:any;
  cities:any;
  contries:any;
  editCompany:any;
  baseurl:string = this.url.BASE_URL;
  
  constructor(private fb:FormBuilder, private company:CompanyService,
    private http:HttpClient, private url: UrlserviceService) { 
      this.editCompany = localStorage.getItem('editCompany');
    this.http.get(this.baseurl+'company/getCountry/countries').subscribe(result =>{
      this.contries = result;

    })
  }

  ngOnInit() {
  
  	if(this.editCompany){
      setTimeout(() => 
      {
      let country = this.addressForm.get('country').value;        
      this.getState(country);
      },1000);
      setTimeout(() => 
      {
      let state = this.addressForm.get('state').value; 
      console.log(state);       
      this.getCity(state);
      },3000);
      
	}
	else{
	 
	}
  }

getState(val){ 
    this.company.getState(val).then(result=>{
        this.states = result;
    })
  }

  getCity(val){
    this.company.getCity(val).then(result=>{
      this.cities = result;
    })
  }

}
