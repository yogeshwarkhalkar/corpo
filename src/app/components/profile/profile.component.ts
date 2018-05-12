import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NavbarService } from '../../services/navbar.service';
import { UrlserviceService } from '../../services/urlservice.service';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

	profileForm: FormGroup;
	id: any;
	userinfo:any;
	phone:any;

  constructor(private http: HttpClient, private router: Router, private fb:FormBuilder, public nav:NavbarService,
    private url:UrlserviceService, private cookie:CookieService) {
  	this.id= this.cookie.get('userid');
  	this.http.get(this.url.BASE_URL+'user/register?id='+this.id).subscribe(res=>{
  		this.userinfo = res;
  		this.phone = this.userinfo['phone'];
  		console.log(this.phone);

  	})
   }

  ngOnInit() {
  		console.log(this.phone);


  	this.profileForm = this.fb.group({
  		username: [null],
  		password: [null],
  		password1: [null],
  		clientid:[null],
  		question:[null],
  		dob:[null],
  		address: this.fb.group({
  			address1:[null],
  			address2:[null],
  			address3:[null],
  			city:[null],
  			state:[null],
  			country:[null]
  		}),
  		phone:[this.phone],
  		email:[null]
  	});
  	
  }

}
