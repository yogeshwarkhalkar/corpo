/* Component to show all Meeting(BM,EGM,AGM) logs */

import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UrlserviceService } from '../../../services/urlservice.service';
import { saveAs,Blob } from 'file-saver/FileSaver';
import { PagerService } from '../../../services/pager.service';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Select2OptionData } from 'ng4-select2';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
declare var $:any;
declare var jQuery:any;

@Component({
  selector: 'app-meeting-log',
  templateUrl: './meeting-log.component.html',
  styleUrls: ['./meeting-log.component.css']
})
export class MeetingLogComponent implements OnInit {
  resolutionForm:FormGroup;
  company:any;
  meetingData:any;	
  status:any;
  files: File = null;
  formdata = new FormData();
  nullCount:number = 0;
  pager: any = {};
  pagedItems: any[];
  searchText:string;
  boardMeeting:any;
  directors:any;
  meetingId:any;
  agendas:any=[];


  exampleData: Array<Select2OptionData>;
  options: Select2Options;
  current: string;
  value: string[];
  selectedId:any;

  matter:any;
  agendaArray:any[]=[]

  constructor(private http: HttpClient, private url:UrlserviceService, private cookie: CookieService,
  	private router: Router, private actRoute:ActivatedRoute, private pagerService: PagerService,private fb: FormBuilder) {

    $('#upload1').click(function(){
      $('#upload_file1').click();
    });      

    $('#upload2').click(function(){
      $('#upload_file2').click();
    });      

    $('#upload3').click(function(){
      $('#upload_file3').click();
    });      

    $('#upload4').click(function(){
      $('#upload_file4').click();
    });      


    jQuery(document).ready( function($) {
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
          $('#upload1').click(function(){
            $('#upload_file1').click();
          });      

          $('#upload2').click(function(){
            $('#upload_file2').click();
          });      

          $('#upload3').click(function(){
            $('#upload_file3').click();
          });      

          $('#upload4').click(function(){
            $('#upload_file4').click();
          });      



        });
    actRoute.params.subscribe(param=>{
      this.company = param['id'];
      this.status = param['status'];

    })

  }
  baseurl:string=this.url.BASE_URL;

  ngOnInit() {

    this.actRoute.paramMap.subscribe((param: ParamMap)=>{
      this.selectedId = parseInt(param.get('selected'));
    })

    this.options = {
      multiple: true
    }
    
    this.resolutionForm = this.fb.group({
      director:[null, Validators.required],
      agenda:[null,Validators.required],
      place:[null, Validators.required]

    });
    this.value=[];
    console.log(this.company,this.status)
    if(this.selectedId){
      this.http.get(this.baseurl+'workflow/storeMeeting/'+this.company+'/'+this.status+'/'+this.selectedId).subscribe(res=>{
      this.meetingData = res;
      console.log(this.meetingData);

      this.setPage(1);

    })

    }
    else{
      this.http.get(this.baseurl+'workflow/storeMeeting/'+this.company+'/'+this.status).subscribe(res=>{
      this.meetingData = res;
      console.log(this.meetingData);

      this.setPage(1);

    })

    }

    

  }

setPage(page: number) {
  if (page < 1 || page > this.pager.totalPages) {
    return;
  }
        // get pager object from service
        this.pager = this.pagerService.getPager(this.meetingData.length, page);
        // get current page of items
        this.pagedItems = this.meetingData.slice(this.pager.startIndex, this.pager.endIndex + 1);
      }

      showFiles(field,files){
        this.http.get(this.baseurl+'workflow/showAgendaDoc/'+field+'/'+files,{responseType:'blob'}).subscribe(res=>{
          saveAs(res,field+'.docx')
        })
      }

      process(obj) {
        for (let i in obj) {
          let child = obj[i];
          if (child === null)
            this.nullCount+=1;
          else if (typeof(child)=="object")
            this.process(child);
        }
      }

      goto(id){
        console.log(id);
        this.http.get(this.baseurl+'workflow/updateBMSteps/'+id).subscribe(res=>{
          let step = +res['steps'];
          let process = res['process'];
          
          this.http.get(this.baseurl+'workflow/getMeeting/'+id).subscribe(res=>{
            this.cookie.put('meetingSerial',res['board_meeting']['serial'])
            localStorage.setItem('bmId',id);
            this.router.navigateByUrl('/activity/'+this.company+'/'+process+'/'+step);
          });    
        })
      }

      update(id){
        this.router.navigateByUrl('/update-bm/'+id);
      }

      uploadAgendaFiles(i, id, name, file: FileList){
        if(name == 'agenda_doc'){
          this.router.navigateByUrl('/activity/')
          this.router.navigateByUrl('/activity/'+this.company+'/2/32');

        }
        
      }

      changed(data: {value: string[]}) {
        this.current = data.value.join(' | ');
        console.log(data.value);
        this.agendaArray=data.value;
        this.resolutionForm.get('agenda').setValue(' ');
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

      generateResolution(id,type){
        localStorage.setItem('meeting_type', type);
        this.meetingId = id;
        this.agendas=[];
        this.resolutionForm.reset();
        this.http.get(this.baseurl+'workflow/getMeeting/'+this.meetingId).subscribe(res=>{
          console.log(res);
          this.exampleData=[];
          this.cookie.put('meetingSerial',res['board_meeting']['serial'])
          let result = res['board_meeting']['agenda'];
          for(let a in result){
            this.agendas.push(result[a]);
            this.exampleData.push({id:result[a],text:result[a]});
          }
          localStorage.setItem('bmId',id);
          this.cookie.putObject('agendas',this.exampleData);

          this.router.navigateByUrl('/activity/'+this.company+'/2/35');
          
          console.log(this.exampleData);
        });
        

      }  
}