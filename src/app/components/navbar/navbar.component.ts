/*Navbar component*/

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavbarService } from '../../services/navbar.service';
import { AuthService } from '../../services/auth.service';
import { UrlserviceService } from '../../services/urlservice.service';
import { CookieService } from 'ngx-cookie';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	passwordForm:FormGroup;
  baseurl:any;
  changed:any;
  constructor(public nav: NavbarService, private auth: AuthService, private fb:FormBuilder,
     private http: HttpClient, private url:UrlserviceService,private cookie:CookieService,
     private router:Router) { }
  ngOnInit() {
    this.baseurl = this.url.BASE_URL;
    this.passwordForm = this.fb.group({
      oldpassword:[null,Validators.required],
      newpassword:[null,Validators.required],
      newpassword2:[null,Validators.required]
    });
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

  changePassword(){
    if(this.passwordForm.valid){
    let userId = this.cookie.get('userid');
    let oldpass = this.passwordForm.get('oldpassword').value;
    let newpass = this.passwordForm.get('newpassword').value;
    let data = {
      old_password:oldpass,
      new_password:newpass
    }
    this.http.post(this.baseurl+'user/change_password/'+userId,JSON.stringify(data)).subscribe(res=>{
      console.log(res);
      this.changed=res;
    })
  }
  else{
    this.validateAllFormFields(this.passwordForm);
  }

  }
  addCompany(){
    localStorage.removeItem('editCompany');
    this.router.navigateByUrl("/createCompany2")
  }
  logout(){
  	this.auth.logout();
  }

}
