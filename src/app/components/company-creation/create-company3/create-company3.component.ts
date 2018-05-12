import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private auth: AuthService, private company: CompanyService) { 
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

  onSubmit(){
    this.company.addData(this.form3.value);
  }


  logout(){
    this.auth.logout();
  }

}
