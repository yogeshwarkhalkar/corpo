/*Component to upload company documents*/

import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { UrlserviceService } from '../../../services/urlservice.service';

declare var jQuery:any;
@Component({
  selector: 'app-create-company5',
  templateUrl: './create-company5.component.html',
  styleUrls: ['./create-company5.component.css']
})
export class CreateCompany5Component implements OnInit {
  form5: FormGroup;
  files: File = null;
  formdata = new FormData();
  userName: any;
  constructor(private auth: AuthService, private http: HttpClient, private fb: FormBuilder,
    private url: UrlserviceService, private router:Router) {
    this.userName = localStorage.getItem('userName');
    this.form5 = this.fb.group({
      
      files: this.fb.group({
      residence: [null,Validators.required],
      digitalSignature:[null],
      pan:[null,Validators.required],
      photo:[null],
      bill:[null],
      saleDeed:[null],
      leaseDeed:[null],
      rentReceipt:[null],
      bankStmt:[null],
      license:[null],
      passport:[null],
      aadhar:[null],
      rentNoc:[null],
      })
    });
    console.log(this.form5);

   }
   baseurl:string = this.url.BASE_URL;


  ngOnInit() {  	
      jQuery(document).ready( function($) {
          // Disable scroll when focused on a number input.
          $('form').on('focus', 'input[type=number]', function(e) {
              $(this).on('wheel', function(e) {
                  e.preventDefault();
              });
          });
          // Restore scroll on number inputs.
          $('form').on('blur', 'input[type=number]', function(e) {
              $(this).off('wheel');
          });
          // Disable up and down keys.
          $('form').on('keydown', 'input[type=number]', function(e) {
              if ( e.which == 38 || e.which == 40 )
                  e.preventDefault();
          });
            
          $('#button1').click(function(){
          $('#resi').click();
          });      
          $('#button2').click(function(){
          $('#sign').click();
          });
          $('#button3').click(function(){
          $('#pan').click();
          });    
          $('#button4').click(function(){
          $('#photo').click();
          });   
          $('#button5').click(function(){
          $('#bill').click();
          });   
          $('#button6').click(function(){
          $('#sale').click();
          });  
          $('#button7').click(function(){
          $('#lease').click();
          });  
          $('#button8').click(function(){
          $('#rent').click();
          }); 
          $('#button9').click(function(){
          $('#bankStmt').click();
          });  
          $('#button10').click(function(){
          $('#license').click();
          }); 
          $('#button11').click(function(){
          $('#passport').click();
          });  
          $('#button12').click(function(){
          $('#aadhar').click();
          });  
          $('#button13').click(function(){
          $('#noc').click();
          });  
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

  uploadFiles(){
    if(this.form5.valid){
    console.log(this.formdata);
    this.http.post(this.baseurl+'company/uploader/',this.formdata).subscribe(res=>{
      console.log(res);
      this.router.navigateByUrl('/dashboard');
    })
  }
  else{
    this.validateAllFormFields(this.form5);
  }
  }

  handleFileInput(name,file: FileList){
    console.log(file);
    this.files = file.item(0);
    this.formdata.append("file", this.files, this.files.name);
    alert(name +' uploaded.')
  }


logout(){
  this.auth.logout();
}
}
