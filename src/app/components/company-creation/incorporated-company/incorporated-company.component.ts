/*Component to add already incorporated company*/

import { Component, OnInit } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {CompanyService} from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';
import { UrlserviceService } from '../../../services/urlservice.service';

@Component({
  selector: 'app-incorporated-company',
  templateUrl: './incorporated-company.component.html',
  styleUrls: ['./incorporated-company.component.css']
})
export class IncorporatedCompanyComponent implements OnInit {
incorporation: FormGroup;
get director(): FormArray{
    return <FormArray>this.incorporation.get('director');
  }

  get shareholder(): FormArray{
    return <FormArray>this.incorporation.get('shareholder');
  }
  constructor(private http: HttpClient, private fb: FormBuilder, private company: CompanyService, 
    private auth: AuthService, private url:UrlserviceService, private router:Router) { }

  cities: any;
  states: any;
  contries: any; 
  nationality:any;
  baseurl:string = this.url.BASE_URL;

  ngOnInit() {
  	 this.incorporation = this.fb.group({
      name: [null, Validators.required],
      address: this.fb.group({
        address1: [null, Validators.required],
        address2:[null],
        address3:[null],
        city: ["Select City",Validators.required],
        state_or_province: ["Select State", Validators.required],
        pincode: [null, [Validators.required,Validators.minLength(6), Validators.maxLength(6)]]
      }),
      cin: [null, Validators.required],
      
      director: this.fb.array([this.buildDirector(),this.buildDirector()]),
      
      shareholder: this.fb.array([this.buildShareholder(), this.buildShareholder()])
    });

  this.http.get(this.baseurl+'company/getState/101').subscribe(result =>{
      this.states = result;
    })

  	     this.http.get(this.baseurl+'company/getCountry/countries').subscribe(result =>{
      this.contries = result;

    })
    this.http.get(this.baseurl+'company/nationality').toPromise()
    .then(res=>{
      this.nationality = res;
    })
  }


buildDirector(): FormGroup{
   
    return this.fb.group({
        DIN: [null],
        name: [null, Validators.required],
        address: this.fb.group({
          addressLine1: [null, Validators.required],
          addressLine2: [null],
          addressLine3: [null],
          city: ['Select City', Validators.required],
          state: ['Select State', Validators.required],
          country: ['Select Country', Validators.required]
        }),
        pincode: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        date_of_birth: [null, Validators.required],
        contact_number: [null, [Validators.required,Validators.pattern(/^\+?\d{10}$/)]],
        email: [null, [Validators.required, Validators.email]],
        nationality: ['Select Nationality', Validators.required],
        fathers_name: [null, Validators.required],
        mothers_name: [null, Validators.required]
      });
  
  }

  buildShareholder(): FormGroup{
  
    return this.fb.group({
      // domicile: [null, Validators.required],
      name: [null, Validators.required],
      address: this.fb.group({
        addressLine1: [null, Validators.required],
        addressLine2: [null],
        addressLine3: [null],
        country: ['Select Country', Validators.required],
        state: ['Select State', Validators.required],
        city: ['Select City', Validators.required]
       
      }),
      pincode: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      date_of_birth: [null, Validators.required],
      contact_number: [null, [Validators.required, Validators.pattern(/^\+?\d{10}$/)]],
      email: [null, [Validators.required, Validators.email]],
      nationality: ['Select Nationality', Validators.required],
      fathers_name: [null, Validators.required],
      mothers_name: [null, Validators.required]
    });
  
  }

getCity1(){
  let state= this.incorporation.get('address').get('state_or_province').value;
  console.log(state);
  this.http.get(this.baseurl+'company/getCity/'+state).subscribe(result =>{
    this.cities = result;

  })
  
}
  getState(val){ 
    console.log(val);
     this.http.get(this.baseurl+'company/getState/'+val).toPromise()
      .then(result =>{
      this.states = result;
    })
  }

  getCity(val){
    console.log(val);
  this.http.get(this.baseurl+'company/getCity/'+val).toPromise() 
  .then(result =>{
      this.cities = result;
    })
  }

  

  addDir():void{
     this.director.push(this.buildDirector());
  }
  removeDir(i: number) {
    this.director.removeAt(i);
  }
  addSh() {
    this.shareholder.push(this.buildShareholder());
  }
  removeSh(i: number){
    this.shareholder.removeAt(i);
  }

  logout(){
    this.auth.logout();
  }
  validateAllFormFields(formGroup) {         
  Object.keys(formGroup.controls).forEach(field => {  
    const control = formGroup.get(field);             
    if (control instanceof FormControl) {             
      // console.log(control);
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        
      // console.log(control);
      this.validateAllFormFields(control);            
    }
    else if (control instanceof FormArray) {        
      for(let c of control.controls)
      this.validateAllFormFields(c);            
    }
  });
}

  saveInfo(){
    if(this.incorporation.valid){
    this.company.storeData(this.incorporation.value);
    this.router.navigateByUrl('/dashboard');
  }
  else{
    console.log('invalid form');
    this.validateAllFormFields(this.incorporation);
  }
  }

}
