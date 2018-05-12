import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UrlserviceService } from '../../services/urlservice.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
	resetForm: FormGroup;
	id:any;

  constructor(private http:HttpClient, private fb:FormBuilder, private router: Router, private act: ActivatedRoute,
    private url:UrlserviceService) {
  	this.act.params.subscribe(params=>{
  		this.id = params['id']
  	})
   }

  ngOnInit() {
  	this.resetForm = this.fb.group({
  		password: [null, Validators.required],
  		repassword: [null, Validators.required]
  	});
  }

  onReset(){
  	let data = {'id':this.id,
  				'password':this.resetForm.get('password').value}
  	this.http.post(this.url.BASE_URL+'user/reset_password', JSON.stringify(data)).subscribe(res=>{
  		console.log(res);
  	})
  }

}
