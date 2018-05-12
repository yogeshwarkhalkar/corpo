import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  get director(): FormArray{
    return <FormArray>this.form4.get('director');
  }

  get shareholder(): FormArray{
    return <FormArray>this.form4.get('shareholder');
  }
  constructor(private http: HttpClient, private fb: FormBuilder,
              private auth: AuthService, private company: CompanyService, private url: UrlserviceService) {
    this.userName = localStorage.getItem('userName');
    this.form4 = this.fb.group({
      authorised_capital: [null, [Validators.required, Validators.min(100000)]],
      shares: [null, Validators.required],
      shareValue: [null, [Validators.required, Validators.min(10)]],
      holdDin: [null, Validators.required],
      director: this.fb.array([this.buildDirector(),this.buildDirector()]),
      nonResident: [null, Validators.required],
      shareholder: this.fb.array([this.buildShareholder(), this.buildShareholder()])
    });

    console.log(this.form4);

  }

  cities: any;
  states: any;
  contries: any; 
  baseurl:string = this.url.BASE_URL;

  ngOnInit() {

    this.http.get(this.baseurl+'company/getCountry/countries').subscribe(result =>{
      this.contries = result;

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

  buildDirector(): FormGroup{
    return this.fb.group({
        DIN: [null, Validators.required],
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

  buildShareholder(): FormGroup{
    return this.fb.group({
      domicile: [null, Validators.required],
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
      contact_number: [null, [Validators.required, Validators.pattern(/^\+?\d{10}$/)]],
      email: [null, [Validators.required, Validators.email]],
      nationality: ['Select Nationality', Validators.required],
      fathers_name: [null, Validators.required],
      mothers_name: [null, Validators.required]
    });
  }

  Hide(){
    this.hide = false;
  }

  Show(){
    this.hide = true;
  }

  

  getState(val){ 
    console.log(val);
     this.http.get(this.baseurl+'company/getState/'+val).subscribe(result =>{
      this.states = result;
    })
  }

  getCity(val){
    console.log(val);
  this.http.get(this.baseurl+'company/getCity/'+val).subscribe(result =>{
      this.cities = result;

    })
  }

  addDir():void{
     this.director.push(this.buildDirector());
  }
  removeDir(i: number) {
    this.director.removeAt(i);
  }
  addSh() {
    this.shareholder.push(this.buildShareholder());
  }
  removeSh(i: number){
    this.shareholder.removeAt(i);
  }

  logout(){
    this.auth.logout();
  }

  onSubmit(){
    this.company.storeData(this.form4.value);
  }

}


