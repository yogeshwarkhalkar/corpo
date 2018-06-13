/* Component to Enter company Incorporation details*/

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormArray, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {CompanyService} from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';
import { UrlserviceService } from '../../../services/urlservice.service';



@Component({
  selector: 'app-create-company2',
  templateUrl: './create-company2.component.html',
  styleUrls: ['./create-company2.component.css']
})
export class CreateCompany2Component implements OnInit {

  form2: FormGroup;
  userName: any;
  editCompany:any;

  industry=['Advertising','Clean Tech', 'Cloud Computing','Consumer Electronics','Energy','Enterprise Software','Gaming',
  'Internet','Networking','Semiconductor','Social Media','Wireless','Digital Media','Mobile'];
  constructor(private http: HttpClient, private fb: FormBuilder, private company: CompanyService, 
    private auth: AuthService, private url:UrlserviceService, private router:Router) {
    this.userName = localStorage.getItem('userName');
    this.editCompany = localStorage.getItem('editCompany');

    
  }


  cities: any;
  states: any;
  baseurl:string = this.url.BASE_URL;


  ngOnInit() {

        this.form2 = this.fb.group({
      name: [null, Validators.required],
      property_type: [null, Validators.required],
      industry_type: this.fb.array([]),
      address: this.fb.group({
        address1: [null, Validators.required],
        address2:[null],
        address3:[null],
        city: ["Select City",Validators.required],
        state_or_province: ["Select State", Validators.required],
        pincode: [null, [Validators.required,Validators.minLength(6), Validators.maxLength(6)]]
      }),
      description: [null, Validators.required]      
    });
    if(this.editCompany){
      this.http.get(this.baseurl+'company/editCompany/'+this.editCompany).toPromise()
      .then(res=>{
        console.log(res);
      // console.log(this.company.editCompanyData);
      // let addr = this.company.editCompanyData['address'];
      let addr = res['address'];
      let splitted = addr.split(',');
      let len = splitted.length;
      let industry = res['metadata']['industry_type'];
      console.log(industry);
      this.form2 = this.fb.group({
        name: [res['name'], Validators.required],
        property_type: [res['metadata']['property_type'], Validators.required],
        industry_type: this.fb.array([industry]),
        address: this.fb.group({
          address1: [addr, Validators.required],
          address2:[null],
          address3:[null],
          state_or_province: [res['state_or_province'], Validators.required],
          city: [res['city'],Validators.required],
          pincode: [splitted[len-1], [Validators.required,Validators.minLength(6), Validators.maxLength(6)]]
        }),
        description: [res['description'], Validators.required]      
      });

      this.company.getState(101).then(result=>{
        this.states = result;
        this.getCity();  
      });
      
    });
    

  }
  else{
    this.company.getState(101).then(result=>{
        this.states = result;
      });
  }

 
  }

  onChange(industry:string, isChecked: boolean) {
    const industryTypeArray = <FormArray>this.form2.controls.industry_type;
    
    if(isChecked) {
      industryTypeArray.push(new FormControl(industry));
    } else {
      let index = industryTypeArray.controls.findIndex(x => x.value == industry)
      industryTypeArray.removeAt(index);
    }
  }

  validateSpecialCharacters() 
  { 
let spclChars = "!@#$%^&*()"; // specify special characters 
let content = this.form2.get('name').value; 
for (var i = 0; i < content.length; i++) 
{ 
  if (spclChars.indexOf(content.charAt(i)) != -1) 
  { 
    alert ("Special characters are not allowed."); 
    this.form2.get('name').setValue(""); 
    return false; 
  } 
} 
} 

// Validator function for form
validateAllFormFields(formGroup: FormGroup) {         
  Object.keys(formGroup.controls).forEach(field => {  
    const control = formGroup.get(field);             
    if (control instanceof FormControl) {             
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        
      this.validateAllFormFields(control);            
    }
  });
}


getCity(){
  let state= this.form2.get('address').get('state_or_province').value;
  this.company.getCity(state).then(result=>{
    this.cities = result;
  })
}

saveInfo(){
  if(this.form2.valid){
    if(this.editCompany){
      this.company.updateData(this.form2.value,this.editCompany);
      this.router.navigateByUrl('/createCompany3');
    }
    else{
    this.company.addData(this.form2.value);
    this.router.navigateByUrl('/createCompany3');
  }
  }
  else{
    this.validateAllFormFields(this.form2)
  }

  }
  
  logout(){
    this.auth.logout()
  }

}
