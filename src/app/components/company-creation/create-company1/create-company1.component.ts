import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {CompanyService} from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-create-company1',
  templateUrl: './create-company1.component.html',
  styleUrls: ['./create-company1.component.css']
})
export class CreateCompany1Component implements OnInit {

  myform: FormGroup;
  userName: any;

  constructor(private http: HttpClient, private fb: FormBuilder, 
    private company: CompanyService, private auth: AuthService) { 
      this.userName = localStorage.getItem('userName');
      this.myform = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, [Validators.required,Validators.pattern(/^\+?\d{10}$/)]],
      address: this.fb.group({
      address1: [null, Validators.required],
      address2: [null],
      address3: [null],
      city: ["Select City",Validators.required],
      state_or_province: ["Select State",Validators.required],
      pincode: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    })

    });

  }

  cities: any;
  states: any;
  data: any;

  ngOnInit() {

    this.http.get('http://127.0.0.1:8000/csautomation/company/getState/').subscribe(result =>{
      this.states = result;

    })
    console.log(this.myform);

  
  }

  getCity(){
    let state= this.myform.get('address').get('state_or_province').value;
    console.log(state);
    this.http.get('http://127.0.0.1:8000/csautomation/company/getCity/'+state).subscribe(result =>{
      this.cities = result;

    })
    
  }



  createClient(): void{
    this.company.addData(this.myform.value)

  }
  logout() {
  this.auth.logout()
}  

}
