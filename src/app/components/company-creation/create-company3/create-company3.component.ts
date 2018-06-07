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

	form3: FormGroup;
  show: boolean = false;
  userName:any;

  constructor(private fb: FormBuilder, private auth: AuthService, 
    private company: CompanyService, private router:Router) { 
    this.userName = localStorage.getItem('userName');
  	this.form3 = this.fb.group({
  		trademark: [null, Validators.required],
      searchType: [null],
      prosecution: [null]
  	})
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
    if(this.form3.valid){
    this.company.addData(this.form3.value);
    this.router.navigateByUrl('/createCompany4');
  }
  else{
    this.validateAllFormFields(this.form3);
  }
  }


  logout(){
    this.auth.logout();
  }

}
