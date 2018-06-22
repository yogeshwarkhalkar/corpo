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

  incorporationDetails: FormGroup;
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
  contries:any;
  baseurl:string = this.url.BASE_URL;


  ngOnInit() {
      this.incorporationDetails = this.fb.group({
      name: [null, Validators.required],
      property_type: [null, Validators.required],
      industry_type: this.fb.array([]),
      address: this.fb.group({
          addressLine1: [null, Validators.required],
          addressLine2: [null],
          addressLine3: [null],
          country: ['Select Country', Validators.required],
          state: ['Select State', Validators.required],        
          city: ['Select City', Validators.required],
          pincode: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
        }),    
      description: [null, Validators.required]      
    });
    if(this.editCompany){
      this.http.get(this.baseurl+'company/editCompany/'+this.editCompany).toPromise()
      .then(res=>{
      let addr = res['address'];
      let leng = addr.length;
      let pinl = leng - 6;
      let pincode = addr.substring(pinl);
      addr = addr.substring(0,pinl);
      addr = addr.replace(/,\s*$/, "");
      console.log(pincode,leng);
      let splitted = addr.split(',');
      let len = splitted.length;
      let industry = res['metadata']['industry_type'];
      if(industry == null){
      industry = [];     
      }
      console.log(industry);
      this.incorporationDetails = this.fb.group({
        name: [res['name'], Validators.required],
        industry_type: this.fb.array(industry),
        property_type: [res['metadata']['property_type'], Validators.required],
        
        address: this.fb.group({
          addressLine1: [addr, Validators.required],
          addressLine2: [null],
          addressLine3: [null],
          country: [res['country'], Validators.required],
          state: [res['state'], Validators.required],        
          city: [res['city'], Validators.required],
          pincode: [pincode, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
        }),    
        description: [res['description'], Validators.required]      
      });
      console.log(res['country'],res['state'],res['city']);
      
      
    });
    

  }
  
  }

  onChange(industry:string, isChecked: boolean) {
    const industryTypeArray = <FormArray>this.incorporationDetails.controls.industry_type;
    
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
let content = this.incorporationDetails.get('name').value; 
for (var i = 0; i < content.length; i++) 
{ 
  if (spclChars.indexOf(content.charAt(i)) != -1) 
  { 
    alert ("Special characters are not allowed."); 
    this.incorporationDetails.get('name').setValue(""); 
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


saveInfo(){
  if(this.incorporationDetails.valid){
    if(this.editCompany){
      this.company.updateData(this.incorporationDetails.value,this.editCompany);
      this.router.navigateByUrl('/createCompany3');
    }
    else{
    this.company.addData(this.incorporationDetails.value);
    this.router.navigateByUrl('/createCompany3');
  }
  }
  else{
    this.validateAllFormFields(this.incorporationDetails)
  }

  }
  
  logout(){
    this.auth.logout()
  }

}
