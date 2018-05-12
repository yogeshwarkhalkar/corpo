import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-search-company',
  templateUrl: './search-company.component.html',
  styleUrls: ['./search-company.component.css']
})
export class SearchCompanyComponent implements OnInit {
	myform:FormGroup;
	searchText:string;
  constructor(private fb:FormBuilder) { }

  ngOnInit() {
  	this.myform = this.fb.group({
  		criteria:[null,Validators.required],
  		searchText:[null,Validators.required]
  	})
  }
searchCompany(){
	if(this.myform.valid){
		let criteria = this.myform.get('criteria').value;
		let searchText = this.myform.get('searchText').value;
		console.log(criteria,searchText);
	}
	else{
		this.myform.get('criteria').markAsTouched();
		this.myform.get('searchText').markAsTouched();
	}
}
}
