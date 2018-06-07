import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CookieService, CookieOptionsProvider, CookieOptions } from 'ngx-cookie';

import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { Register } from '../../models/register';
import { NavbarService } from '../../services/navbar.service';
import { UrlserviceService } from '../../services/urlservice.service';

import {NgbModal, NgbActiveModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

declare var $:any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  public user: User = new User();
  public register: Register = new Register();
  loginform: FormGroup;
  regform: FormGroup;                    
  msg:any;
  passwordForm:FormGroup;
  private formSubmitAttempt: boolean; 
  public emailcheck: any;
  reg: any;
  email:string= null;
  pass:string = null;
  remember:any;
  today:any;
  resetmodal:string;
  resetEmail:string;
  closeResult: string;
  next:string=null;
  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder,private url: UrlserviceService,
                public http: HttpClient, private nav: NavbarService, private cookie: CookieService,
                 private ck:CookieOptionsProvider, private modalService: NgbModal, private actroute:ActivatedRoute) {
      if(this.cookie.get('remember')){
      this.email = this.cookie.get('email');
      this.pass = this.cookie.get('password');
      this.remember = this.cookie.get('remember');

    }

    this.actroute.params.subscribe(param=>{
      this.next = param['_next'];
      console.log(this.next);
    });

   }

   baseurl: string = this.url.BASE_URL;


  error: any;

  ngOnInit() {
    

  	$(document).ready(function(){
			
			$("#login-info").show();
			$("#login-register-title").text("Corporatus Login");
			$("#radio-login").prop("checked", true);
			$("#radio-register").prop("checked", false);
			$("#register-info").hide();			

			$("#radio-login").click(function(){
				$("#register-info").hide();
				$("#login-info").show();
				$("#login-register-title").text("Corporatus Login");
			});
			$("#radio-register").click(function(){
				$("#login-info").hide();
				$("#register-info").show();
				$("#login-register-title").text("Corporatus Register");
			});
		});

        localStorage.removeItem('token');
        this.cookie.remove('userid');
        localStorage.removeItem('userName');

        

        
  	
    this.regform = this.fb.group({
      email: [null, [Validators.required,Validators.email]],
      password: [null, Validators.required],
      password2: [null, Validators.required],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      phone: [null, [Validators.required, Validators.pattern("^[7-9][0-9]{9}$")]]
    });

    this.loginform = this.fb.group({
      username: [this.email, Validators.required],
      password: [this.pass, Validators.required],
      remember_me: [this.remember]
    });

    this.passwordForm = this.fb.group({
      resetemail:[null,[Validators.required, Validators.email]]
    })


    
  }

  

  checkEmail(event){
    if (event.key === 'Tab' || event.key === 'Enter' || event.type == 'change'){
    this.http.get(this.baseurl+'user/checkmail?email='+this.register.email).subscribe(data=>{
        
        if (data == false) { 
          this.emailcheck = "";
        }
        else if(data){
        this.emailcheck = "Email already exist";
        if (this.emailcheck){
          this.regform.controls['email'].setErrors({'incorrect':true});
        }
      }
      
    },
    (err: HttpErrorResponse)=>{
      if (err.error instanceof Error){
        console.log("client side error");
      }
      else{
        console.log(err);
      }
    }
    )
  }
  }


   onLogin(): void{
     this.user.email = this.loginform.get('username').value;
     this.user.password = this.loginform.get('password').value;
     this.user.remember_me = this.loginform.get('remember_me').value;

     if(this.user.remember_me){
        
        this.ck.options.storeUnencoded = false;   
       this.cookie.put('email', this.user.email, this.ck.options);
       this.cookie.put('password', this.user.password, this.ck.options);
       this.cookie.put('remember', 'true', this.ck.options);
     }
     else{
        this.cookie.remove('email', this.ck.options);
       this.cookie.remove('password', this.ck.options);
       this.cookie.remove('remember', this.ck.options); 
     }
     this.today = new Date();

    this.auth.login(this.user)
    .then((user) =>{
      console.log(user.token)
      if (user.error){
        this.error = user.error;
      }
      else{
        console.log(user);
        let userid = user['id'];  
        let username = user['first_name'];  
        this.cookie.put('token',user.token);
        //localStorage.setItem('userid', userid);
        this.cookie.put('userid', userid);
        localStorage.setItem('userName', username)
        this.nav.userName = localStorage.getItem('userName');
        if(this.next){
          this.router.navigateByUrl(this.next);
        }
        else{
          this.router.navigateByUrl('/dashboard');
        }

    }
    })
    .catch((err) => {
      console.log(err);
      this.error = "Incorrect Username/Password";
      
    });
  }

  onRegister(): void{

    this.auth.register(this.register)
    .then((register) => {
      this.reg = register['msg'];
      setTimeout(() => 
      {
        this.router.navigate(['/']);
      },3000);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  resetRequest(){
    this.http.post('','email').subscribe(res=>{

    })
  }

  resetPassword(){
   
    console.log(this.resetEmail);
  }


  open(content) {
    this.modalService.open(content).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.resetEmail = this.resetmodal;
      console.log(this.resetmodal , this.resetEmail)
      this.auth.resetPassword(this.resetEmail).subscribe(res=>{
        console.log(res);
        this.msg = res['msg']
      })
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  



}
