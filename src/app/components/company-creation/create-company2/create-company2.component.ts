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

  industry=['Advertising','Clean Tech', 'Cloud Computing','Consumer Electronics','Energy','Enterprise Software','Gaming',
  'Internet','Networking','Semiconductor','Social Media','Wireless','Digital Media','Mobile'];
  constructor(private http: HttpClient, private fb: FormBuilder, private company: CompanyService, 
    private auth: AuthService, private url:UrlserviceService, private router:Router) {
    this.userName = localStorage.getItem('userName');
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
  }

  cities: any;
  states: any;
  baseurl:string = this.url.BASE_URL;


  ngOnInit() {

  	this.http.get(this.baseurl+'company/getState/101').subscribe(result =>{
  		this.states = result;

  	})
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
  console.log(state);
  this.http.get(this.baseurl+'company/getCity/'+state).subscribe(result =>{
    this.cities = result;

  })
  
}

saveInfo(){
  if(this.form2.valid){
    this.company.addData(this.form2.value)
    this.router.navigateByUrl('/createCompany3');
  }
  else{
    this.validateAllFormFields(this.form2)
  }
    //this.company.storeData(this.form2.value);
  }
  
  logout(){
    this.auth.logout()
  }

}
