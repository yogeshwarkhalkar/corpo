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





/*selectOther(matter){
  this.matter = matter;
 }
  addAgenda(){
  console.log(this.matter);
  if(this.matter && this.matter != 'other')
    this.agendaArray.push(this.matter);
  this.resolutionForm.get('agenda').setValue(' ');

}
removeAgenda(i){
  console.log(i);
  this.agendaArray.splice(i,1);
  if(this.agendaArray.length == 0){
    this.resolutionForm.get('agenda').invalid;
  }
}*/



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

      generateResolution(id){
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

 /*setId(id){
    this.meetingId = id;
    this.agendas=[];
    this.resolutionForm.reset();
    this.http.get(this.baseurl+'workflow/getDirector/'+this.company).subscribe(res=>{
      this.directors = res;
      this.http.get(this.baseurl+'workflow/getMeeting/'+this.meetingId+'/'+'board_meeting').subscribe(res=>{
        console.log(res);
        this.exampleData=[];
        let result = res['board_meeting']['agenda'];
        for(let a in result){
          this.agendas.push(result[a]);
          this.exampleData.push({id:result[a],text:result[a]});
        }
     
        console.log(this.exampleData);
      });
    })
  }



  generateResolution(){
    if (this.resolutionForm.valid) {
      this.generateResolution1();
    } else {
      console.log(this.resolutionForm);
      this.validateAllFormFields(this.resolutionForm);
    }

  }
  generateResolution1(){
    console.log(this.resolutionForm.value);
    let did = this.resolutionForm.get('director').value;
    let agenda:Array<any>=[];
    this.http.get(this.baseurl+'workflow/getMeeting/'+this.meetingId+'/'+'board_meeting').subscribe(res=>{
      let directorName:any;
      let din:any;

      for(let d of this.directors){
        console.log(d);
        if(d['id'] == did)
        {
          directorName = d['first_name']+' '+d['last_name'];
          din = d['DIN'];
        }
      }


      let data = {
        doc_id : 34,
        resolution : this.agendaArray,
        companyName: res['company']['name'],
        address:res['board_meeting']['address'],
        serial:res['board_meeting']['serial'],
        bm_date:new Date(res['board_meeting']['bm_date']).getTime(),
        place: this.resolutionForm.get('place').value,
        director_name: directorName,
        din:din
      }
      this.http.post(this.baseurl+'workflow/generateAgenda',JSON.stringify(data),
        {responseType:'blob'}).subscribe(res=>{
          saveAs(res,'Resolution true copy.docx')
        },
        (err:HttpErrorResponse)=>{
          console.log(err)
        })  

      })
    //localStorage.removeItem('bmId');

  }*/

}
