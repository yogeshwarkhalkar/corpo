/*Component to enter company Intellectual property details*/

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {CompanyService} from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-company3',
  templateUrl: './create-company3.component.html',
  styleUrls: ['./create-company3.component.css']
})
export class CreateCompany3Component implements OnInit {

	intellectualProperty: FormGroup;
  show: boolean = false;
  userName:any;
  editCompany:any;

  constructor(private fb: FormBuilder, private auth: AuthService, 
    private company: CompanyService, private router:Router) { 
    this.userName = localStorage.getItem('userName');
    this.editCompany = localStorage.getItem('editCompany');
    if(this.editCompany){
  
  	this.intellectualProperty = this.fb.group({
  		trademark: [this.company.editCompanyData['metadata']['trademark'], Validators.required],
      searchType: [null],
      prosecution: [null]
  	})
  
    if(this.company.editCompanyData['metadata']['trademark'] == 'Yes'){
      this.show=true;
    }
  }
  else{
    this.intellectualProperty = this.fb.group({
      trademark: [null, Validators.required],
      searchType: [null],
      prosecution: [null]
    })
  }
  }

  ngOnInit() {

  }

  Show(){
    this.show=true;
  }
  Hide(){
    this.show=false;
  }

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

  onSubmit(){
    if(this.intellectualProperty.valid){
      if(this.editCompany){
      this.company.updateData(this.intellectualProperty.value,this.editCompany);
      this.router.navigateByUrl('/createCompany4');
    }
    else{
    this.company.addData(this.intellectualProperty.value);
    this.router.navigateByUrl('/createCompany4');
  }
  }
  else{
    this.validateAllFormFields(this.intellectualProperty);
  }
  }


  logout(){
    this.auth.logout();
  }

}
