import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-existing-company',
  templateUrl: './existing-company.component.html',
  styleUrls: ['./existing-company.component.css']
})
export class ExistingCompanyComponent implements OnInit {
	myform:FormGroup;
  constructor(private fb:FormBuilder, private router:Router) { }

  ngOnInit() {

  	this.myform = this.fb.group({
  		inc:[null,Validators.required]
  	})
  }

  submit(){
  	if(this.myform.valid){
  		let val = this.myform.get('inc').value;

  		if(val == 'Yes'){
  			this.router.navigateByUrl('/incorporated');
  		}
  		else{
  			this.router.navigateByUrl('/createCompany2');	
  		}
  	}
  	else{
  		this.myform.get('inc').markAsTouched();
  	}
  }


}
