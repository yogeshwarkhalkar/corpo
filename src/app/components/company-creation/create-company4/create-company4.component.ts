/*Component to enter company Capitalization, Director and Shareholder details*/

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {CompanyService} from '../../../services/company.service';
import { AuthService } from '../../../services/auth.service';
import { UrlserviceService } from '../../../services/urlservice.service';
declare var jQuery:any;
@Component({
  selector: 'app-create-company4',
  templateUrl: './create-company4.component.html',
  styleUrls: ['./create-company4.component.css']
})
export class CreateCompany4Component implements OnInit {

  form4: FormGroup;
  userName: any;
  hide: boolean = false;
  editCompany:any;
  companyData:any;
  editshareholder:any;
  editdirector:any;
  get director(): FormArray{
    return <FormArray>this.form4.get('director');
  }

  get shareholder(): FormArray{
    return <FormArray>this.form4.get('shareholder');
  }
  constructor(private http: HttpClient, private fb: FormBuilder, private router:Router,
              private auth: AuthService, private company: CompanyService, private url: UrlserviceService) {
    this.userName = localStorage.getItem('userName');
    this.editCompany = localStorage.getItem('editCompany');
    

    

if(this.editCompany){
  this.http.get(this.baseurl+'workflow/getDirector/'+this.editCompany).subscribe(res=>{
            this.editdirector = res;
            console.log(this.editdirector);
               for(let i of this.editdirector){
        this.director.push(this.buildDirector(i));      
    }
          })
    this.http.get(this.baseurl+'workflow/getShareholder/'+this.editCompany).subscribe(res=>{
            this.editshareholder = res;
            console.log(this.editshareholder);
            for(let j of this.editshareholder){
      this.shareholder.push(this.buildShareholder(j));
    }
          })
 
    

    this.form4 = this.fb.group({
      authorised_capital: [this.company.editCompanyData['authorised_capital'], [Validators.required, Validators.min(100000)]],
      paid_up_capital:[this.company.editCompanyData['paid_up_capital'],Validators.required],
      shares: [this.company.editCompanyData['metadata']['shares'], Validators.required],
      shareValue: [this.company.editCompanyData['metadata']['shareValue'], [Validators.required, Validators.min(10)]],
      holdDin: [this.company.editCompanyData['metadata']['holdDin'], Validators.required],
      director: this.fb.array([]),
      nonResident: [this.company.editCompanyData['metadata']['nonResident'], Validators.required],
      shareholder: this.fb.array([])
    });

    if(this.company.editCompanyData['metadata']['holdDin'])
      this.hide = true;
    
  }
  else{
    this.form4 = this.fb.group({
      authorised_capital: [null, [Validators.required, Validators.min(100000)]],
      paid_up_capital:[null,Validators.required],
      shares: [null, Validators.required],
      shareValue: [null, [Validators.required, Validators.min(10)]],
      holdDin: [null, Validators.required],
      director: this.fb.array([this.buildDirector(null),this.buildDirector(null)]),
      nonResident: [null, Validators.required],
      shareholder: this.fb.array([this.buildShareholder(null), this.buildShareholder(null)])
    });
  }

    console.log(this.form4);

  }

  cities: any;
  states: any;
  contries: any; 
  nationality:any;
  baseurl:string = this.url.BASE_URL;

  ngOnInit() {

    this.http.get(this.baseurl+'company/getCountry/countries').subscribe(result =>{
      this.contries = result;

    })
    this.http.get(this.baseurl+'company/nationality').toPromise()
    .then(res=>{
      this.nationality = res;
    })

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
            
      });

  }

  buildDirector(data): FormGroup{
    if(data){
      console.log(data);
      let name = data['first_name']+' '+data['last_name'];
      this.getState(data['country']);
      this.getCity(data['state']);
    return this.fb.group({
      id:[data['id']],
        DIN: [data['DIN']],
        name: [name, Validators.required],
        address: this.fb.group({
          addressLine1: [data['address'], Validators.required],
          addressLine2: [null],
          addressLine3: [null],
          country: [data['country'], Validators.required],
          state: [data['state'], Validators.required],
          city: [data['city'], Validators.required]
        }),
        pincode: [data['pincode'], [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        date_of_birth: [data['date_of_birth'], Validators.required],
        contact_number: [data['contact_number'], [Validators.required,Validators.pattern(/^\+?\d{10}$/)]],
        email: [data['email'], [Validators.required, Validators.email]],
        nationality: [data['nationality'], Validators.required],
        fathers_name: [data['fathers_name'], Validators.required],
        mothers_name: [data['mothers_name'], Validators.required]
      });


    }
    else{
    return this.fb.group({
        DIN: [null],
        name: [null, Validators.required],
        address: this.fb.group({
          addressLine1: [null, Validators.required],
          addressLine2: [null],
          addressLine3: [null],
          city: ['Select City', Validators.required],
          state: ['Select State', Validators.required],
          country: ['Select Country', Validators.required]
        }),
        pincode: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        date_of_birth: [null, Validators.required],
        contact_number: [null, [Validators.required,Validators.pattern(/^\+?\d{10}$/)]],
        email: [null, [Validators.required, Validators.email]],
        nationality: ['Select Nationality', Validators.required],
        fathers_name: [null, Validators.required],
        mothers_name: [null, Validators.required]
      });
  }
  }

  buildShareholder(data): FormGroup{
    if(data){
      let name = data['first_name']+' '+data['last_name'];
      this.getState(data['country']);
      this.getCity(data['state']);
      return this.fb.group({
      // domicile: [data[], Validators.required],
      id:[data['id']],
      name: [name, Validators.required],
      address: this.fb.group({
        addressLine1: [data['address'], Validators.required],
        addressLine2: [null],
        addressLine3: [null],
        country: [data['country'], Validators.required],
        state: [data['state'], Validators.required],        
        city: [data['city'], Validators.required]
      }),
      pincode: [data['pincode'], [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      date_of_birth: [data['date_of_birth'], Validators.required],
      contact_number: [data['contact_number'], [Validators.required, Validators.pattern(/^\+?\d{10}$/)]],
      email: [data['email'], [Validators.required, Validators.email]],
      nationality: [data['nationality'], Validators.required],
      fathers_name: [data['fathers_name'], Validators.required],
      mothers_name: [data['mothers_name'], Validators.required]
    });

    }
    else{
    return this.fb.group({
      // domicile: [null, Validators.required],
      name: [null, Validators.required],
      address: this.fb.group({
        addressLine1: [null, Validators.required],
        addressLine2: [null],
        addressLine3: [null],
        country: ['Select Country', Validators.required],
        state: ['Select State', Validators.required],
        city: ['Select City', Validators.required]
       
      }),
      pincode: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      date_of_birth: [null, Validators.required],
      contact_number: [null, [Validators.required, Validators.pattern(/^\+?\d{10}$/)]],
      email: [null, [Validators.required, Validators.email]],
      nationality: ['Select Nationality', Validators.required],
      fathers_name: [null, Validators.required],
      mothers_name: [null, Validators.required]
    });
  }
  }

  Hide(){
    this.hide = false;
  }

  Show(){
    this.hide = true;    
  }

  

  getState(val){ 
    this.company.getState(val).then(result=>{
        this.states = result;
    })
  }

  getCity(val){
    this.company.getCity(val).then(result=>{
      this.cities = result;
    })
  }



  addDir():void{
     this.director.push(this.buildDirector(null));
  }
  removeDir(i: number) {
    this.director.removeAt(i);
  }
  addSh() {
    this.shareholder.push(this.buildShareholder(null));
  }
  removeSh(i: number){
    this.shareholder.removeAt(i);
  }

  logout(){
    this.auth.logout();
  }

  validateAllFormFields(formGroup) {         
  Object.keys(formGroup.controls).forEach(field => {  
    const control = formGroup.get(field);             
    if (control instanceof FormControl) {             
      // console.log(control);
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {        
      // console.log(control);
      this.validateAllFormFields(control);            
    }
    else if (control instanceof FormArray) {        
      for(let c of control.controls)
      this.validateAllFormFields(c);            
    }
  });
}

  onSubmit(){
    if(this.form4.valid){
      if(this.editCompany){
      this.company.updateData(this.form4.value,this.editCompany);
       this.company.updateStakeholder(this.form4.value);
      this.router.navigateByUrl('/createCompany5');
    }
    else{
    this.company.storeData(this.form4.value);
    this.router.navigateByUrl('/createCompany5');
  }
  }
  else{
    console.log('invalid form');
    this.validateAllFormFields(this.form4);
  }
  }

}


