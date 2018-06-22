/*Component for process all activity and workflow*/

import { Component, OnInit, Input, AfterViewInit,ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormArray, FormBuilder, Validators, FormControl } from '@angular/forms';
import { saveAs,Blob } from 'file-saver/FileSaver';
import { UrlserviceService } from '../../../services/urlservice.service';
import { WorkflowService } from '../../../services/workflow.service';
import { PagerService } from '../../../services/pager.service';
import { AuthService } from '../../../services/auth.service';

import { Select2OptionData } from 'ng4-select2';
import { CookieService } from 'ngx-cookie';
import { NgProgress } from 'ngx-progressbar';

import 'rxjs/Rx';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

import * as _ from 'lodash';
declare var $:any;
declare var jQuery:any;


@Component({
	selector: 'app-activity',
	templateUrl: './activity.component.html',
	styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
	@Input() public dataObject;

	@ViewChild('doc') document:ElementRef;

	activityForm: FormGroup;

	public objectProps;
	baseurl:string = this.url.BASE_URL; 
	reader = new FileReader();
	company:any;
	activity: any;
	activityId: any;
	controls: any;
	process: any;
	processId:any;
	steps : any;
	id: number;
	files: File = null;
	formdata = new FormData();
	objectKeys = Object.keys;
	group:any;
	stakeholders:any;
	directors:any;
	shareholders:any;
	directorsId : Array<any>=[];
	stakeholdersId:Array<any>=[];
	emailto:any;
	next:boolean=false;
	navigate: number=1;
	preNav:number;
	nextNav:number;
	lastActivity:number;
	actdata: any;
	remark:any;
	email:boolean=false;
	emailSent:boolean;
	is_last:boolean = false;
	is_first:boolean = false;
	showaddr:boolean=false;
	showserial:boolean=false;
	showmatter:boolean=false;
	showsecretory:boolean=false;
	showbodycorporate:boolean=false;
	companyName:any;
	cin:any;
	address:any;
	city:any;
	state:any;
	place:any;
	meeting:any;
	matter:any;
	agendas:any;
	agendaArray: any[]=[];
	allAgendaArray:any[]=[];
	firstActivityId:any;
	stepId: number;
	formGroup = {};
	meetingId:any;
	meetingNo:any;
	egmNo:any;
	agmNo:any;
	meetingSerials:any;
	bmSerials:any;
	meetingSerial:any;
	isupdate:boolean=false;
	updatedAgenda:any;
	displayFile:any;
	agendaDiff:any;
	showNext:boolean=false;
	uploadedFile:any;
	screenError:any;
	short_doc_id:any;
	long_doc_id:any;
	pager: any = {};
	pagedItems: any[];
	exampleData: Array<Select2OptionData>;
	allAgenda: Array<Select2OptionData>;
	options: Select2Options;
	current: string;
	value:string[];
	resolutionList:any;
	showResolution:boolean=false;
	signingDirector:any;
	meetingDate:any;
	meetingAddress:any;
	currentdatetime:any;
	uploadedCompanyDoc:any;
	eventId:any;
	today:any;
	today1:any;
	bodyEmail:any[]=[];
	noticeFor:any[]=[];
	callingEvent:any;

	constructor(private http:HttpClient, private router: Router,private url:UrlserviceService,
		private actRoute: ActivatedRoute, private fb:FormBuilder, private location: Location,
		private pagerService: PagerService, private auth: AuthService, private cookie: CookieService,
		private workflow: WorkflowService, public progress: NgProgress) {


		this.eventId = localStorage.getItem('eventId');
		console.log(this.eventId);

		// Get URL parameter to determine company, process & activity id

		this.actRoute.params.subscribe(params=> {
			this.id = <number>params['id']
			this.company = params['company']
			this.processId = params['process']
			this.displayFile='';
			this.uploadedFile='';
			
			this.emailSent = false;
			this.showNext = false;
			this.showResolution=false;
			this.resolutionList = null;
			
			console.log(this.processId)
			this.currentdatetime = new Date();

			let date = new Date();
			date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
			let date1 = date.toISOString().split(':');
			this.today = date1[0]+':'+date1[1];
			console.log(this.today);


			this.screenError='';
			if(!this.exampleData)
				this.exampleData = <Array<Select2OptionData>>this.cookie.getObject('agendas');
			if(!this.meetingSerial)
				this.meetingSerial = this.cookie.get('meetingSerial');

			let calling_process = localStorage.getItem('calling_process');	
			this.callingEvent = calling_process;
			let calling_act = parseInt(localStorage.getItem('calling_activity'));
			if((this.processId == 2 && this.id == 29)){
				
				if(!(calling_process && calling_act)){
					this.workflow.getAgenda().subscribe(res=>{
							//console.log(this.agendas);
							this.exampleData=[];

							for(let a in res){
								this.exampleData.push({ id: res[a]['short_agenda'],
									text: res[a]['short_agenda']});
							}
							console.log(this.exampleData);
							this.agendas = res;

							this.options = {
								multiple: true
							}

							
						})
				}
			}
			else if(this.processId != 2 || (calling_process && calling_act)){
				let agendaProcess = this.processId;
				if(calling_process && calling_act){
					agendaProcess = calling_process;
				}
				this.workflow.getProcessAgenda(agendaProcess).subscribe(res=>{
							//console.log(this.agendas);
							this.exampleData=[];

							for(let a in res){
								this.exampleData.push({ id: res[a]['short_agenda'],
									text: res[a]['short_agenda']});
								if(this.agendaArray.length < res.length){
									this.agendaArray.push(res[a]['short_agenda']);
								}
								

							}
							console.log(this.exampleData);
							console.log(this.agendaArray);
							this.agendas = res;

							this.options = {
								multiple: true
							}

							
						})
			}

		//API call to get activity based on process and activity Id
		this.workflow.getActivity(this.processId, this.id).subscribe(res=>{
			console.log(res);
			console.log(res['process_activity']['first_activity']);
			this.activity = res['activity']['name'];
			this.activityId=res['activity']['id'];
			this.group = res['activity']['group'];

			this.process = res['process']['name'];
			this.controls = res['process_activity']['config'];
			this.is_last = res['process_activity']['last_activity'];
			this.is_first = res['process_activity']['first_activity'];
			this.remark = res['process_activity']['remark'];
			console.log(this.is_first);

			if(this.eventId){
				this.workflow.updateProcessActivity(this.eventId,this.activityId).toPromise()
				.then(updateres=>{
					console.log(updateres);
				})

			// GET workflow steps based on workflow ID
			this.workflow.getWorkflowSteps(this.eventId).subscribe(res=>{
				this.steps= res;
				console.log(this.steps)
				this.lastActivity = this.steps.length;
				console.log(this.lastActivity);
			},
			err =>{
				this.steps = "No steps found"
			})
		}

		this.showResolution=false;
		this.dataObject = this.controls;

			//Get all control names from database config
			this.objectProps =
			Object.keys(this.dataObject)
			.map(prop => {
				
				return Object.assign({}, { key: prop} , this.dataObject[prop]);
			});
			for(let prop of Object.keys(this.dataObject)) {
				
				console.log(prop);
				if(prop == 'email'){
					this.email=true;
				}
				if(prop == 'allAgenda' || prop == 'address'){

					this.workflow.getAgenda().subscribe(res=>{
						this.allAgenda=[];
						for(let a in res){
							this.allAgenda.push({ id: res[a]['short_agenda'],
								text: res[a]['short_agenda']});
						}
						console.log(this.allAgenda);
						console.log(this.exampleData);
						this.agendas = res;

						this.options = {
							multiple: true
						}


					})
				}
				// Map the validator to control
				this.formGroup[prop] = new FormControl(this.dataObject[prop].value || '',
					this.mapValidators(this.dataObject[prop].validation));

				console.log(this.formGroup);
			}


			if(this.group == 1 || this.group == 4){
					// GET director of company
					this.http.get(this.baseurl+'workflow/getDirector/'+this.company).subscribe(res=>{
						this.directors = res;
					})
					//GET shareholder and director of company
					this.http.get(this.baseurl+'workflow/getStakeholder/'+this.company).subscribe(res=>{
						this.stakeholders = res;
						console.log(this.stakeholders);
					})
					//GET shareholder of company
					this.http.get(this.baseurl+'workflow/getShareholder/'+this.company).subscribe(res=>{
						this.shareholders = res;
						console.log(this.shareholders);
					})


				}

				// GET Board Meeting Serial No for company
				this.http.get(this.baseurl+'workflow/boardMeeting/'+this.company+'/BM').subscribe(res=>{
					console.log(res);
					this.bmSerials = res;
				})

				// GET company Name, CIN, Address, city ,state
				this.workflow.getCompany(this.company).subscribe(res=>{
					console.log(res);
					this.companyName = res['company']['name'];
					this.cin = res['company']['cin'];
					this.address=res['company']['address'];
					this.city=res['city']['name'];
					this.state=res['state_or_province']['name'];

				})

				this.activityForm = this.fb.group(this.formGroup);

				jQuery(document).ready( function($) {

					$('#button').click(function(){
						$('#resi').click();
					});      
					$('#button1').click(function(){
						$('#resi1').click();
					});      
					$('#button2').click(function(){
						$('#resi2').click();
					});      
					$('#button3').click(function(){
						$('#resi3').click();
					});      
					$('#button4').click(function(){
						$('#resi4').click();
					});  
					$('#button5').click(function(){
						$('#resi5').click();
					});  
					$('#button6').click(function(){
						$('#resi6').click();
					});      
				});
				
				$(document).ready(function(){
					$('[data-toggle="popover"]').popover();   
				});



				// Get the meeting type and assign meeting specific data
				for(let prop of this.objectProps){
					if(prop.use == 'board_meeting'){
						this.setfileName(prop.name);
					}
					if(prop.use == 'egm_meeting'){
						this.setfileName(prop.name);
					}
					if(prop.use == 'agm_meeting'){
						this.setfileName(prop.name);
					}
					if(prop.key == 'checklist'){
						if (prop.stakeholder){
							this.emailto = 'stakeholder'
						}
						else{
							this.emailto = 'director'
						}
					}

					//Based on meeting type get meeting count 
					if(prop.key == 'meeting1'){
						
						this.http.get(this.baseurl+'workflow/boardMeeting/'+this.company).subscribe(res=>{
							console.log(res);
							this.meetingSerials = res;
						})
						if(prop.type=='BM'){
							this.meeting = 'BM' ;
							this.short_doc_id = prop.short_id;
							this.long_doc_id = prop.long_id;
							this.http.get(this.baseurl+'workflow/generateAgenda/'+this.company+'/BM').subscribe(res=>{
								this.meetingNo = res;
								console.log(res);

							})
						}
						if(prop.type=='EGM'){
							this.meeting = 'EGM';
							this.short_doc_id = prop.short_id;
							this.long_doc_id = prop.long_id;
							this.http.get(this.baseurl+'workflow/generateAgenda/'+this.company+'/EGM').subscribe(res=>{
								this.meetingNo = res;
								console.log(res);

							})
						}
						if(prop.type=='AGM'){
							this.meeting = 'AGM';
							this.short_doc_id = prop.short_id;
							this.long_doc_id = prop.long_id;
							this.http.get(this.baseurl+'workflow/generateAgenda/'+this.company+'/AGM').subscribe(res=>{
								this.meetingNo = res;
								console.log(res);

							})
						}	
					}
				}

			},
			(err:HttpErrorResponse)=>{
				console.log(err)
			});





// GET the first activity Id to calculate steps in workflow
this.workflow.getFirstActivity(this.processId).subscribe(res=>{
	this.firstActivityId = res['activity'];
	this.stepId = (this.id - this.firstActivityId)+1;
	console.log(this.stepId);
})



});

console.log(this.id);

}

ngOnInit() {
	this.location.subscribe(x => this.stepId -= 1);
	this.setPage(1);
	
	this.options = {
		multiple: true
	}

}

// Validator function for form
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

// Validate the past date selection for meeting date
dateValidator(val){
	console.log(val);
	if(val <= this.today){
		this.activityForm.get('matter').setErrors({'incorrect':true});
		console.log('invalid date');
	}
	else{
		this.activityForm.get('matter').setErrors(null);
		
	}

}    

// Map validator function with validator from html configuration in database
private mapValidators(validators) {
	const formValidators = [];
	if(validators) {
		for(const validation of Object.keys(validators)) {
			if(validation === 'required') {
				formValidators.push(Validators.required);
			} else if(validation === 'min') {
				formValidators.push(Validators.min(validators[validation]));
			}
			else if(validation === 'email') {
				formValidators.push(Validators.email);
			}
		}
	}

	return formValidators;
}

// Check Notice for Body Corpotare or Individual option
checkOption(key, event){
	if(key == 'address_1'){
		if(event.target.checked){
			if(event.target.value == 'bodycorporate')
				this.showbodycorporate = true;
			this.noticeFor.push(event.target.value);
			console.log(this.noticeFor);
		}
		else{
			if(event.target.value == 'bodycorporate')
				this.showbodycorporate = false;
			let index = this.noticeFor.indexOf(event.target.value)
			console.log(index);
			this.noticeFor.splice(index,1);
			console.log(this.noticeFor);

		}
	}
}
// Update event table on selecting existing Board Meeting
onChangeCheck(key, selected){
	console.log(key, selected)

	if(key == 'director'){
		let eventId = localStorage.getItem('eventId');
		let eventData = {
			board_meeting:selected,
			steps:this.id
		};
		//Get selected Board Meeting data
		this.workflow.getBoardMeeting(selected).subscribe(res=>{
			console.log(res);
			let agenda = res['board_meeting']['agenda'];
			let bmDate = res['board_meeting']['bm_date'];
			let today = new Date();
			console.log(bmDate);
			console.log(today.toDateString());
			console.log(today.toISOString());
			console.log(today.toLocaleString());
			// if(bmDate > today.toISOString())
			// {
			// 	this.screenError = "Without completing Board Meeting you can't trigger EGM";
			// 	this.showNext = false;
			// }
			// else{

				this.exampleData=[];

				for(let a in agenda){
					console.log(a)
					this.exampleData.push({ id: agenda[a],
						text: agenda[a]});
				}
				console.log(this.exampleData);
				//this.agendas = res;

				this.options = {
					multiple: true
				}
				this.http.post(this.baseurl+'workflow/updateEvent/'+eventId,JSON.stringify(eventData)).subscribe(res=>{
					console.log(res);
				})	
				this.showNext = true;


			// }

		});
	}
	this.showNext = true;
}

// Check is there any available BM to link with workflow
checkAvailableMeeting(value,key){
	if((this.bmSerials.length <= 0)&& value == 'Yes'){
		this.screenError = "There is no available Board Meeting please Create New";		
		this.validateAllFormFields(this.activityForm);
		this.activityForm.get(key).setErrors({'required':true});
		this.showNext  = false;
		
	}
	else{
		this.screenError = null;
		this.activityForm.get(key).setErrors(null);
		this.showNext  =true;
	}
}

// Show textbox based on redio select 'Other'
onRadioClick(key, option){
	console.log(option, key);
	if(key=='date' && option == 'Other'){
		this.showaddr =true;
	}
	else if(option == 'Registered Office'){
		this.showaddr =false;
	}
	if(key=='descr' && option == 'Other'){
		this.showserial=true;
	}
	else if(option == 'System Generated'){
		this.showserial=false;
	}
	if((key=='serial' || key=='upload') && option == 'secretory'){
		this.showsecretory = true;
	}
	else if((key=='serial' || key=='upload') && option == 'director'){
		this.showsecretory = false;
	}
	this.showNext = true;
}


// GET uploaded file name (ex. Agenda, Attendance, MOM, Resolution)
setfileName(name){
	console.log(name);
	let bmid = localStorage.getItem('bmId');
	this.http.get(this.baseurl+'workflow/getFilename/'+bmid+'/'+name).subscribe(res=>{
		console.log(res);
		this.uploadedFile = res;
	})

}


selectOther(matter){
	this.matter = matter;
	console.log(this.matter);
	if (matter == 'other'){
		this.showmatter = true;
	}
	else{
		this.showmatter=false;
	}

}

// Add Matter on selection to list
changed(data: {value: string[]}) {
	// this.current = data.value.join(' | ');
	this.agendaArray=data.value;
	console.log(this.agendaArray);
	this.activityForm.get('date_1').setValue(' ');
}

changed1(data: {value: string[]}) {
	console.log("resolution ",data.value);

	this.agendaArray=data.value;
	// this.activityForm.get('agendas').setValue(' ');
	console.log(this.agendaArray);
}

changed2(data: {value: string[]}) {
	console.log("resolution ",data.value);
	this.allAgendaArray=data.value;
}


// Update Agenda
updateAgenda(){
	if(this.activityForm.valid){
		let bm = this.activityForm.get('director').value;
		let headers = new HttpHeaders({'Content-Type': 'application/json'});
		let data={
			bm:bm,
			company:this.company,
			agenda:this.agendaArray
		}
		this.http.post(this.baseurl+'workflow/updateAgenda', JSON.stringify(data)).subscribe(ret=>{
			console.log(ret);
			this.updatedAgenda = ret;
			this.isupdate = true;
			this.generateNotice();
		})
	}
	else{
		this.validateAllFormFields(this.activityForm);
	}
}

//Generate Attendance Sheet for BM, EGM, AGM
generateAttendance(docId){
	let absentDirector:Array<any>=[];
	let allDirector:Array<any>=[];	
	let presentDirector:Array<any>=[];

	let absentShareholder:Array<any>=[];
	let allShareholder:Array<any>=[];	
	let presentShareholder:Array<any>=[];
	let bmid = localStorage.getItem('bmId');
	let mdate:number;

	this.workflow.getBoardMeeting(bmid).subscribe(res=>{
		let meetingDate = new Date(res['board_meeting']['bm_date']);
		let today = new Date();
		console.log(today,meetingDate);
		// if(meetingDate > today)
		// {
		// 	alert('Wait for meeting to complete');
		// 	localStorage.removeItem('calling_process');
		// 	localStorage.removeItem('calling_activity');
		// 	localStorage.removeItem('bmId');
		// 	localStorage.removeItem('calling_event');
		// 	this.router.navigateByUrl('/dashboard');
		// 	// return;
		// }
		// else{
			mdate = new Date(res['board_meeting']['bm_date']).getTime();
			if(this.emailto == 'director'){
				for (let d of this.directors) {
					let name= d['first_name']+' '+d['last_name'];
					for(let id of this.directorsId){
						if(d['id'] == id){
							let name= d['first_name']+' '+d['last_name'];
							absentDirector.push(name.toLocaleUpperCase());
							break;
						}
						if(d['id'] != id){
							let name= d['first_name']+' '+d['last_name'];
							presentDirector.push(name.toLocaleUpperCase());	
							break;
						}
					}
					allDirector.push(name.toLocaleUpperCase());		
					if(!presentDirector.includes(name.toLocaleUpperCase()) && !absentDirector.includes(name.toLocaleUpperCase())){
						presentDirector.push(name.toLocaleUpperCase());

					}
				}
		//Get Board Meeting data
		// this.workflow.getBoardMeeting(bmid).subscribe(res=>{
			let data = {
				doc_id:docId,
				allDirector:allDirector,
				absentDirector:absentDirector,
				company:this.companyName,
				meetingDate:mdate,
				addr:this.address,
				serial:res['board_meeting']['serial'],
				place: res['board_meeting']['address']
			}

		//GET meeting date for attendance sheet name
		let d = (new Date(res['board_meeting']['bm_date'])+'').split(' ');
		console.log(d);
		let d1 = [d[2], d[1], d[3]].join('');

		// Download Attendance sheet
		this.http.post(this.baseurl+'workflow/generateAttendance',JSON.stringify(data),{responseType:'blob'}).subscribe(res=>{
			console.log(res);
			this.showNext = true;
			saveAs(res,'Attendance sheet_'+d1+'.docx')

		})

	// })
}
if(this.emailto == 'stakeholder'){
	for (let stk of this.stakeholders) {
		let name = stk['first_name']+' '+stk['last_name'];
		for(let did of this.directors){
			let name = did['first_name']+' '+did['last_name'];
			if (!allDirector.includes(name.toLocaleUpperCase()))
				allDirector.push(name.toLocaleUpperCase());		
			for(let d of this.stakeholdersId){
				if(did['id'] == String(d)){
					let name= did['first_name']+' '+did['last_name'];
					if (!absentDirector.includes(name.toLocaleUpperCase())){
						absentDirector.push(name.toLocaleUpperCase());
					}
					break;
				}
				if(did['id'] != String(d)){
					let name= did['first_name']+' '+did['last_name'];
					if (!presentDirector.includes(name.toLocaleUpperCase())){
						presentDirector.push(name.toLocaleUpperCase());
					}
					break;
				}
			}
			if(!presentDirector.includes(name.toLocaleUpperCase()) && !absentDirector.includes(name.toLocaleUpperCase())){
				presentDirector.push(name.toLocaleUpperCase());
			}
		}
		for(let sid of this.shareholders){
			let name= sid['first_name']+' '+sid['last_name'];
			if (!allShareholder.includes(name.toLocaleUpperCase()))
				allShareholder.push(name.toLocaleUpperCase())
			for(let s of this.stakeholdersId){
				if(sid['id'] == String(s)){
					let name= sid['first_name']+' '+sid['last_name'];
					if (!absentShareholder.includes(name.toLocaleUpperCase())){
						absentShareholder.push(name.toLocaleUpperCase());
					}
					break;	
				}
				if(sid['id'] != String(s)){
					let name= sid['first_name']+' '+sid['last_name'];
					if (!presentShareholder.includes(name.toLocaleUpperCase())){
						presentShareholder.push(name.toLocaleUpperCase());
					}
					break;
				}

			}
			if(!presentShareholder.includes(name.toLocaleUpperCase()) && !absentShareholder.includes(name.toLocaleUpperCase())){
				presentShareholder.push(name.toLocaleUpperCase());

			}
		}


		
	}


		// this.workflow.getBoardMeeting(bmid).subscribe(res=>{
			let data = {
				doc_id:docId,
				allDirector:allDirector,
				allShareholder: allShareholder,
				absentDirector:absentDirector,
				absentShareholder: absentShareholder,
				presentShareholder: presentShareholder,
				company:this.companyName,
				meetingDate:mdate,
				addr:this.address,
				serial:res['board_meeting']['serial'],
				place: res['board_meeting']['address']
			}

		//GET meeting date for attendance sheet name
		let d = (new Date(res['board_meeting']['bm_date'])+'').split(' ');
		console.log(d);
		let d1 = [d[2], d[1], d[3]].join('');

		// Download Attendance sheet
		this.http.post(this.baseurl+'workflow/generateAttendance',JSON.stringify(data),{responseType:'blob'}).subscribe(res=>{
			console.log(res);
			this.showNext = true;
			saveAs(res,'Attendance sheet_'+d1+'.docx')

		})

	// })
}

console.log(allDirector);
	// GET meeting data to generate attendance sheet
	

	let dirData={
		director_present:presentDirector,
		director_absent:absentDirector,
		member_present:presentShareholder,
		member_absent:absentShareholder,
		steps:this.id
	}

	// Update meeting data after generating attendance sheet
	this.http.post(this.baseurl+'workflow/updateNotice/'+bmid,JSON.stringify(dirData)).subscribe(res=>{
		console.log(res);
	})
	this.showNext = true;
// }

});




}


// Generate Minutes of Meeting for BM, EGM, AGM
generateMinutes(docId){
	let bmid = localStorage.getItem('bmId');
	let result:any;
	let today = new Date();
	let position:any;
	let serial:any;

	// GET meeting data to generate MOM
	this.workflow.getBoardMeeting(bmid).subscribe(res=>{
		result=res
		serial = res['board_meeting']['serial'];
		console.log(res);
		if(res['board_meeting']['approved_by_director']){
			position = 'Director';
		}
		else
			position  = 'Company Secretary';
		let data = {
			doc_id:docId,
			position:position,
			companyName: res['company']['name'],
			address:res['board_meeting']['address'],
			serial:res['board_meeting']['serial'],
			agenda: res['board_meeting']['agenda'],
			bm_date:new Date(res['board_meeting']['bm_date']).getTime(),
			place:res['board_meeting']['address'],
			directorPresent:res['board_meeting']['director_present'],
			directorAbsent:res['board_meeting']['director_absent'],
			memberPresent:res['board_meeting']['member_present'],
			memberAbsent:res['board_meeting']['member_absent']
		}
		this.exampleData=[];
		for(let a in res['board_meeting']['agenda']){
			this.exampleData.push({id:res['board_meeting']['agenda'][a],text:res['board_meeting']['agenda'][a]})
		}
		this.options = {
			multiple: true
		}

		console.log(this.exampleData);

		this.cookie.putObject('agendas', this.exampleData);		
		// Download MOM
		this.http.post(this.baseurl+'workflow/generateAgenda',JSON.stringify(data),
			{responseType:'blob',
			headers:new HttpHeaders().append('Content-Type', 'text/plain; charset=utf-8')}).subscribe(res=>{
				saveAs(res,'minutes of meeting-'+serial+'.docx')
			},
			(err:HttpErrorResponse)=>{
				console.log(err)
			})	


		})
	let data={steps:this.id};
	// Update Meeting completed steps
	this.http.post(this.baseurl+'workflow/updateNotice/'+bmid,JSON.stringify(data)).subscribe(res=>{
		console.log(res);
	})				
	this.showNext = true;

}

// GEnerate Resolution for BM, EGM, AGM
generateResolution(docId){
	let meeting_type:any;
	if(this.activityForm.get('upload').valid &&	this.activityForm.get('matter').valid ){
		if(this.agendaArray.length <= 0){
			this.activityForm.get('agendas').reset();			
			this.validateAllFormFields(this.activityForm);
			return;
		}
		else{
			this.activityForm.get('agendas').clearValidators();
			this.activityForm.get('agendas').setValidators(null);
			this.activityForm.get('agendas').updateValueAndValidity();
		}

		let bmid = localStorage.getItem('bmId');
		let agenda:Array<any>=[];
		let dirAddress:any;
		let position:any;
		let did = this.activityForm.get('upload').value;
		let place = this.activityForm.get('matter').value;
		console.log(this.agendaArray);
		if(this.allAgendaArray.length > 0){
			for(let a of this.allAgendaArray){
				console.log(a);
				if(!this.agendaArray.includes(a)){
					this.agendaArray.push(a);
				}
			}
			console.log(this.allAgendaArray);
			console.log(this.agendaArray);
		}

		meeting_type = localStorage.getItem('meeting_type');
		if(meeting_type == 'EGM')
			docId = 39;
		

	// GET required data to generate Resolution from board_meeting table
	this.workflow.getBoardMeeting(bmid).subscribe(res=>{
		console.log(res);
		let result = res['board_meeting']['agenda'];
		let directorName:any;
		let din:any;

		if(this.showsecretory){
			directorName = did;
			din = null;
			dirAddress = this.address;
			position  = 'Company Secretary';
		}
		else{	
			for(let d of this.directors){
				console.log(d);
				if(d['id'] == did)
				{
					directorName = d['first_name']+' '+d['last_name'];
					din = d['DIN'];
					dirAddress = d['address'];
				}
			}
			position = 'Director';

		}	

		let data = {
			doc_id : docId,
			resolution : this.agendaArray,
			companyName: res['company']['name'],
			address:res['board_meeting']['address'],
			serial:res['board_meeting']['serial'],
			bm_date:new Date(res['board_meeting']['bm_date']).getTime(),
			place:place,
			director_name: directorName,
			din:din,
			dirAddress:dirAddress,
			position:position
		}

		// Download Resolution
		this.http.post(this.baseurl+'workflow/generateAgenda',JSON.stringify(data),
			{responseType:'blob',
			headers:new HttpHeaders().append('Content-Type', 'text/plain; charset=utf-8')}).subscribe(res=>{
				saveAs(res,'Resolution true copy.docx')
			},
			(err:HttpErrorResponse)=>{
				console.log(err)
			})	

		})

		// Update completed meeting steps
		let data={steps:this.id};
		this.http.post(this.baseurl+'workflow/updateNotice/'+bmid,JSON.stringify(data)).subscribe(res=>{
			console.log(res);
		})				
		this.showNext = true;
		this.cookie.remove('meetingSerial');
		this.meetingSerial=null;
	}
	else{
		this.validateAllFormFields(this.activityForm);
	}
	if(meeting_type)
		localStorage.removeItem('meeting_type');

}

	// Upload Resolution document
	uploadResolution(file: FileList){
		if(this.activityForm.get('serial').valid && this.activityForm.get('issue').valid){
			let id = localStorage.getItem('bmId');

			let filename:any;
			let serial:any;
			let agendaType:any;

			let issue =this.activityForm.get('serial').value;
			let reason = this.activityForm.get('issue').value;
			

			this.files = file.item(0);
			this.formdata.append("file", this.files, this.files.name);
			console.log(this.files,this.formdata);

			let data = {
				issue:issue,
				reason:reason,
				file: this.files
			}

			this.http.post(this.baseurl+'workflow/uploadResolution/'+id+'/'+issue+'/'+reason,this.formdata).subscribe(res=>{
				console.log(res)
				this.uploadedFile = res;

			});

			this.showNext = true;
			this.formdata.delete("file");
		}
		else{
			confirm('Enter info to upload resolution');
			this.activityForm.get('upload').setValue(' ');
			this.activityForm.get('matter').setValue(' ');
			this.activityForm.get('meeting').setValue(' ');
			this.validateAllFormFields(this.activityForm);
		}


	}

	// Show the previous resolution generated for meeting
	previousResolution(){
		let bmid=localStorage.getItem('bmId');
		this.workflow.getPreviousResolution(bmid).subscribe(res=>{
			if(res['resolution']){
				this.showResolution=true;
				console.log(res);

				this.resolutionList = res['resolution'];
				this.meetingSerial = res['serial']
			}
			else{
				this.resolutionList = "Previous resolution is not available."
			}

		});

	}

	generateOfferLetter(docid){

		console.log(this.activityForm.get('signing').value, docid);
		if(this.activityForm.valid){

			let bmid = localStorage.getItem('bmId');

			let did = this.activityForm.get('signing').value;
			let place = this.activityForm.get('location').value;
			let data:any;
			console.log(did,place);

	// GET required data to generate offer letter
	
	let directorName:any;
	let din:any;
	let address:any;

	for(let d of this.directors){
		console.log(d);
		if(d['id'] == did)
		{
			directorName = d['first_name']+' '+d['last_name'];
			din = d['DIN'];
			address = d['address'];
		}
	}

	data = {
		doc_id : docid,			
		companyName: this.companyName,
		address: address,		
		place:place,
		director_name: directorName,
		din:din
	}

		// Download Offer Letter
		this.http.post(this.baseurl+'workflow/generateOfferLetter',JSON.stringify(data),
			{responseType:'blob',
			headers:new HttpHeaders().append('Content-Type', 'text/plain; charset=utf-8')}).subscribe(res=>{
				saveAs(res,'Offer Letter.docx')
			},
			(err:HttpErrorResponse)=>{
				console.log(err)
			})	

			this.showNext = true;
		}
		else{
			this.validateAllFormFields(this.activityForm);
		}


	}
	sendOfferLetter(){
		this.uploadedCompanyDoc;
		this.workflow.sendOfferLetter(this.uploadedCompanyDoc,this.company).subscribe(res=>{
			console.log(res);
			alert("Mail send");
		});
	}

	generatePas4(){
		let docId=45;

		if(this.activityForm.valid){
			let director = this.activityForm.get('serial').value;
			let place = this.activityForm.get('meeting').value;
			let din:any;
			let directorName:any;
			let dirAddress:any;
			for (var d of this.directors) {

				if(d['id'] == director){
					din = d['DIN'];
					directorName= d['first_name']+' '+d['last_name'];
					this.signingDirector = directorName;
					dirAddress = d['address'];
				}
			}

			let data={
				doc_id:docId,
				place:place,
				directorName:directorName,
				din:din,
				dirAddress:dirAddress,
				company:this.companyName
			}
			console.log(data);
			this.http.post(this.baseurl+'workflow/generatePas4',JSON.stringify(data),{responseType:'blob'}).subscribe(res=>{
				// console.log(res);
				saveAs(res,'PAS-4.docx');
				
			})


		}
		else{
			this.validateAllFormFields(this.activityForm);
		}
	}
	// Download previous resolution document
	showResDoc(filename){
		let httpParams = new HttpParams()
		.set('filename', filename);
		this.http.get(this.baseurl+'workflow/showResolutionDoc',{params:httpParams, responseType:'blob', observe:'response'}).subscribe(res=>{
			let filename = res.headers.get('Content-Disposition');
			saveAs(res.body,filename);
		})

	}

	// Check form validation for generate Agenda
	generateNotice(){
		if (this.activityForm.valid) {

			this.generateAgenda();
		} else {
			console.log('invalid');
			console.log(this.activityForm);
			this.validateAllFormFields(this.activityForm);
		}

	}



	// Generate Agenda Document for BM, EGM, AGM
	generateAgenda(){
		let din :any;
		let id :any;
		let directorName:any;
		let directorId:any;
		let diff:any;
		let addr:any;
		let matter:any;
		let place:any;
		let serial:any;
		let bmdate:any;
		let getdate:any;
		let storedate:any;
		let description:any;
		let venue:any;
		let dirAddress:any;
		let office:any;
		let position:any;
		let today = new Date();
		let bmid = localStorage.getItem('bmId');
		let currentBm = localStorage.getItem('bmId');
		getdate = new Date(this.activityForm.get('matter').value);
		storedate = new Date(this.activityForm.get('matter').value);

		/*SERVER*/
		storedate.setMinutes(storedate.getMinutes()-(getdate.getTimezoneOffset()));
		getdate.setMinutes(getdate.getMinutes()-getdate.getTimezoneOffset());
		/*LOCAL*/
		// storedate.setMinutes(storedate.getMinutes()-storedate.getTimezoneOffset());

		diff = (Math.abs(today.getTime() - getdate.getTime()))/(1000 * 60 * 60 * 24);		
		directorId = this.activityForm.get('serial').value;
		addr = this.activityForm.get('date').value;
		matter = this.activityForm.get('date_1').value;
		place = this.activityForm.get('meeting').value;
		description = this.activityForm.get('director').value;
		serial = this.activityForm.get('descr').value;
		console.log(this.agendaArray);
		if(this.allAgendaArray.length > 0){
			for(let a of this.allAgendaArray){
				console.log(a);
				if(!this.agendaArray.includes(a)){
					this.agendaArray.push(a);
				}
			}
		}
		console.log(this.agendaArray);

			// this.agendaArray = this.agendaArray.concat(this.allAgendaArray);

			if(this.agendaArray.length <= 0){
				alert("Select matter to transact");
				return;
			}

		//console.log(new Set(...this.agendaArray , ...this.allAgendaArray));


		bmdate=getdate.getTime();
		this.meetingDate = bmdate;
		console.log(addr);
		if(addr != 'Registered Office'){
			if(addr == null || addr == "Other"){
				alert("Enter Venue of Meeting");
				return;
			}
			venue = addr;
			office = ' ';

		}	
		else{
			venue = this.address;
			office = "the registered office of the Company at"

		}

		console.log(venue);

		if (serial == 'System Generated'){

			let today = new Date();
			let month = today.getMonth()+1;
			if(month<=3){
				month+=9;
			}
			else{
				month-=3
			}
			let quarter = Math.floor((month) / 3);
			var fiscalYr = "";
			if (month > 3) { 
				var nextYr1 = (today.getFullYear() + 1).toString();
				fiscalYr = today.getFullYear().toString() + "-" + nextYr1.charAt(2) + nextYr1.charAt(3);
			} else {
				var nextYr2 = today.getFullYear().toString();
				fiscalYr = (today.getFullYear() - 1).toString() + "-" + nextYr2.charAt(2) + nextYr2.charAt(3);
			}
			console.log(today, month, fiscalYr);
			if(currentBm){
				this.meetingNo-=1;
			}
			if(this.meeting == 'BM'){
				if(this.meetingNo <10)
					serial = 'Q'+quarter+'-BM-0'+this.meetingNo+'/-'+fiscalYr;
				else
					serial = 'Q'+quarter+'-BM-'+this.meetingNo+'/-'+fiscalYr;
			}
			if(this.meeting == 'EGM'){
				if(this.meetingNo <10)
					serial = 'Q'+quarter+'-EGM-0'+this.meetingNo+'/-'+fiscalYr;
				else
					serial = 'Q'+quarter+'-EGM-'+this.meetingNo+'/-'+fiscalYr;

			}			
			if(this.meeting == 'AGM'){
				if(this.meetingNo <10)
					serial = 'Q'+quarter+'-AGM-0'+this.meetingNo+'/-'+fiscalYr;
				else
					serial = 'Q'+quarter+'-AGM-0'+this.meetingNo+'/-'+fiscalYr;

			}			
		}

		if(this.showsecretory){
			if(directorId == 'secretory' || directorId == null){
				alert("Enter Company Secretary Name");
				return;
			}
			this.signingDirector = directorId;
			directorName = directorId;
			dirAddress = this.address;
			din = null;
			position = 'Company Secretary';
		}
		else{	
			for (var d of this.directors) {

				if(d['id'] == directorId){
					din = d['DIN'];
					directorName= d['first_name']+' '+d['last_name'];
					this.signingDirector = directorName;
					dirAddress = d['address'];
				}
			}
			position = 'Director';
		}

		this.meetingAddress = venue;

		let data = {
			doc_id : id,
			companyName: this.companyName,
			// approved_by_director: directorId,
			director_name:directorName,
			din: din,
			address: venue,
			state: this.state,
			city: this.city,
			agenda: this.agendaArray,
			place: place,
			bm_date: storedate,
			serial: serial,
			company : this.company,
			status: 'open',
			description: description,
			steps: this.id,
			meeting_type:this.meeting,
			process:this.processId,
			event:this.eventId
		}

		if(this.showsecretory){
			data['approved_by_director'] = null;
		}
		else{
			data['approved_by_director'] = directorId;
		}



		// If meeting is already created then update meeting data
		if(currentBm){
			this.workflow.getBoardMeeting(currentBm).subscribe(res=>{
				this.meetingSerial = res['board_meeting']['serial'];
				serial = this.meetingSerial;
				console.log(serial);
				this.cookie.put('meetingSerial', res['board_meeting']['serial']);
				this.http.post(this.baseurl+'workflow/updateNotice/'+currentBm,JSON.stringify(data)).subscribe(res=>{
					console.log(res);
				})		

			});
			localStorage.setItem('bmId',currentBm);
		}
		// Save the new meeting entry in database
		else{	
			for(let ser of this.meetingSerials){
				if(ser[0] == serial)
				{
					console.log(serial);
					alert("Serial Number Exists");
					return;
				}
			}
			this.workflow.storeMeeting(data).subscribe(res=>{
				console.log(res);
				this.meetingId = res['id'];
				//this.meetingSerial = res['serial'];
				this.cookie.put('meetingSerial', res['serial']);
				localStorage.setItem('bmId',this.meetingId);
				// localStorage.setItem('currentBm',this.meetingId);
				let eventId = localStorage.getItem('eventId');
				console.log(eventId, this.meeting);
				console.log(localStorage.getItem('bmId'));
				let eventData:any;
				if(this.meeting == 'BM'){
					eventData = {
						board_meeting:this.meetingId,
						steps:this.activityId
					}
				}
				if(this.meeting == 'EGM'){
					eventData = {
						egm:this.meetingId,
						steps:this.activityId
					}
				}
				if(this.meeting == 'AGM'){
					eventData = {
						agm:this.meetingId,
						steps:this.activityId
					}
				}
				if(!this.callingEvent){
					if(eventId){
						this.http.post(this.baseurl+'workflow/updateEvent/'+eventId,JSON.stringify(eventData)).subscribe(res=>{
							console.log(res);
						});		
					}
				}

			})
		}

		/*If differance between meeting date and today's date is less than 8 days,
		generate shorter notice and send to director with Agenda*/
		if((this.meeting == 'EGM' && diff < 21)){
			let mailTo: any;
			for(let to of this.noticeFor){
				if(to == 'bodycorporate'){
					mailTo = this.bodyEmail;
					let id = this.short_doc_id;
					let directorName1:any;
					for(let d of mailTo){
						//din = d['DIN'];
						console.log(d);
						directorName1= d;
						let data1 = {
							doc_id : 43,
							companyName: this.companyName,
							approved_by_director: directorId,
							director_name:directorName,
							co_director:directorName1,
							din: din,
							address: this.address,
							state: this.state,
							city: this.city,
							agenda: this.agendaArray,
							place: place,
							bm_date: bmdate,
							serial: serial,
							venue:venue,
							cin:this.cin,
							dirAddress:dirAddress,
							office:office
						}
						console.log(directorName1);
						this.workflow.generateAgenda(data1).subscribe(res=>{
							saveAs(res, ('Body Corporate Shorter Consent - EGM.docx'))
						},
						(err:HttpErrorResponse)=>{
							console.log(err)
						})		
						data1['doc_id']=30;
						this.workflow.generateAgenda(data1).subscribe(res=>{
							saveAs(res, ('Body Corporate-Authorisation Form for attending EGM.docx'))
							let emailData = {
								email:d,
								meeting:this.meeting,
								company:this.companyName,
								bm_date:bmdate,
								address:this.address,
								directorName:directorName,
								to:'bodycorporate'
							}

							this.http.post(this.baseurl+'workflow/sendShortNotice',JSON.stringify(emailData)).toPromise()
							.then((res)=>{console.log(res);})
							.catch((err)=>{console.log(err);})

						},
						(err:HttpErrorResponse)=>{
							console.log(err)
						})		
					}

				}
				else if(to == 'individual'){
					mailTo = this.shareholders;
					let id = this.short_doc_id;
					let directorName1:any;
					for(let d of mailTo){
						console.log(d);
				//din = d['DIN'];
				directorName1= d['first_name']+' '+d['last_name'];		
				let data1 = {
					doc_id : 44,
					companyName: this.companyName,
					approved_by_director: directorId,
					director_name:directorName,
					co_director:directorName1,
					father_name:d['fathers_name'],
					din: din,
					address: this.address,
					state: this.state,
					city: this.city,
					agenda: this.agendaArray,
					place: place,
					bm_date: bmdate,
					serial: serial,
					venue:venue,
					cin:this.cin,
					dirAddress:d['address'],
					office:office

				}
				console.log(directorName1);
				this.workflow.generateAgenda(data1).subscribe(res=>{
					saveAs(res, ('Individual Shorter Consent - EGM - '+d['first_name']+'.docx'))
					let emailData = {
						meeting:this.meeting,
						company:this.companyName,
						bm_date:bmdate,
						address:this.address,
						directorName:directorName,
						to:'individual',
						shareholder:d['first_name']+' '+d['last_name']
					}
					this.http.post(this.baseurl+'workflow/sendShortNotice/'+d['id'],JSON.stringify(emailData)).toPromise()
					.then(res=>{console.log(res)})
					.catch(err=>{console.log(err)});
				},
				(err:HttpErrorResponse)=>{
					console.log(err)
				})		
			}
		}
	}


	id = this.long_doc_id;
	console.log(this.agendaArray);
	let data = {
		doc_id : id,
		companyName: this.companyName,
		cin:this.cin,
		approved_by_director: directorId,
		director_name:directorName,
		din: din,
		address: this.address,
		co_director:directorName,
		state: this.state,
		city: this.city,
		agenda: this.agendaArray,
		place: place,
		bm_date: bmdate,
		serial: serial,
		venue:venue,
		dirAddress:dirAddress,
		office:office,
		position:position
	}

	this.workflow.generateAgenda(data).subscribe(res=>{
		saveAs(res, this.meeting+' Agenda - '+serial+'.docx');
	},
	(err:HttpErrorResponse)=>{
		console.log(err)
	})	
}


else if(( this.meeting == 'BM' && diff < 8)){
	let mailTo: any;
	mailTo = this.directors;
	
	let id = this.short_doc_id;
	let directorName1:any;
	for(let d of mailTo){
		console.log(d);
				//din = d['DIN'];
				directorName1= d['first_name']+' '+d['last_name'];		
				let data1 = {
					doc_id : id,
					companyName: this.companyName,
					approved_by_director: directorId,
					director_name:directorName,
					co_director:directorName1,
					din: d['DIN'],
					address: this.address,
					state: this.state,
					city: this.city,
					agenda: this.agendaArray,
					place: place,
					bm_date: bmdate,
					serial: serial,
					venue:venue,
					cin:this.cin,
					dirAddress:d['address'],
					office:office

				}
				console.log(directorName1);
				this.workflow.generateAgenda(data1).subscribe(res=>{
					saveAs(res, (this.meeting+' Shorter Consent - '+d['first_name']+' '+d['last_name']+' - '+serial+'.docx'))
					let emailData = {
						meeting:this.meeting,
						company:this.companyName,
						bm_date:bmdate,
						address:this.address	
					}
					this.http.post(this.baseurl+'workflow/sendShortNotice/'+d['id'],JSON.stringify(emailData)).toPromise()
					.then(res=>{console.log(res)})
					.catch(err=>{console.log(err)});
				},
				(err:HttpErrorResponse)=>{
					console.log(err)
				})
			}

			id = this.long_doc_id;

			let data = {
				doc_id : id,
				companyName: this.companyName,
				cin:this.cin,
				approved_by_director: directorId,
				director_name:directorName,
				din: din,
				address: this.address,
				state: this.state,
				city: this.city,
				agenda: this.agendaArray,
				place: place,
				bm_date: bmdate,
				serial: serial,
				venue:venue,
				dirAddress:dirAddress,
				office:office,
				position:position
			}

			this.workflow.generateAgenda(data).subscribe(res=>{
				saveAs(res, this.meeting+' Agenda - '+serial+'.docx');
			},
			(err:HttpErrorResponse)=>{
				console.log(err)
			})	
		}
		else if(( this.meeting == 'AGM' && diff < 8)){
			let mailTo: any;
			mailTo = this.stakeholders;
			let id = this.short_doc_id;
			console.log(id,diff, this.meeting);
			let directorName1:any;
			for(let d of mailTo){
				console.log(d);
			directorName1= d['first_name']+' '+d['last_name'];		
			let data1 = {
				doc_id : this.short_doc_id,
				companyName: this.companyName,
				approved_by_director: directorId,
				director_name:directorName,
				co_director:directorName1,
				father_name:d['fathers_name'],
				din: din,
				address: this.address,
				state: this.state,
				city: this.city,
				agenda: this.agendaArray,
				place: place,
				bm_date: bmdate,
				serial: serial,
				venue:venue,
				cin:this.cin,
				dirAddress:d['address'],
				office:office

			}
			console.log(directorName1);
			this.workflow.generateAgenda(data1).subscribe(res=>{
				saveAs(res, ('Shorter Consent - AGM - '+d['first_name']+'.docx'))
				let emailData = {
					meeting:this.meeting,
					company:this.companyName,
					bm_date:bmdate,
					address:this.address,
					directorName:directorName,
					stakeholder:d['first_name']+' '+d['last_name']
				}
				this.http.post(this.baseurl+'workflow/sendShortNotice/'+d['id'],JSON.stringify(emailData)).toPromise()
				.then(res=>{console.log(res)})
				.catch(err=>{console.log(err)});
			},
			(err:HttpErrorResponse)=>{
				console.log(err)
			})		
		}	
	}

				/*If differance between meeting date and today's date is greater than 8,
				generate Agenda*/
				else{

					let id = this.long_doc_id;
					let data = {
						doc_id : id,
						companyName: this.companyName,
						cin:this.cin,
						approved_by_director: directorId,
						director_name:directorName,
						din: din,
						address: this.address,
						state: this.state,
						city: this.city,
						agenda: this.agendaArray,
						place: place,
						bm_date: bmdate,
						serial: serial,
						venue:venue,
						dirAddress:dirAddress,
						office:office,
						position:position
					}
					console.log(data);
					this.workflow.generateAgenda(data).subscribe(res=>{
						saveAs(res, this.meeting+' Agenda - '+serial+'.docx');
					},
					(err:HttpErrorResponse)=>{
						console.log(err)
					})	
				}

				this.http.get(this.baseurl+'workflow/boardMeeting/'+this.company).subscribe(res=>{
					this.meetingSerials = res;
				})

				this.showNext = true;

			}


			onChange(id:string, isChecked:boolean){
				if(isChecked) {
					if(this.emailto == 'director'){
						this.directorsId.push(id);
						console.log(this.directorsId);
					}    
					if(this.emailto == 'stakeholder'){
						this.stakeholdersId.push(id);
					}
					console.log(this.emailto);

				} else {
					if(this.emailto == 'director'){
						let index = this.directorsId.indexOf(id)
						console.log(index);
						this.directorsId.splice(index,1);	
					}
					if(this.emailto == 'stakeholder'){
						let index = this.stakeholdersId.indexOf(id)
						this.stakeholdersId.splice(index,1);
					}	
					console.log(this.directorsId);

				}
			}

			ValidateEmail(mail) 
			{
				if(mail){
					let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
					if (mail.match(mailformat))
					{
						return (true)
					}
					alert("Please enter valid email address!")
					return (false)
				}
			}

			checkEmail(key,event){

				if (event.key === 'Tab' || event.key === 'Enter' || event.type == 'change'){
					if(key == 'address_1'){
						if (!this.ValidateEmail(this.activityForm.get('address_1').value)) {
							return;
						}

						if(this.activityForm.get('address_1').valid){
							let email = this.activityForm.get('address_1').value;
							if(!this.bodyEmail.includes(email))
								this.bodyEmail.push(email);    
							this.activityForm.get('address_1').clearValidators();

						}
					}
					else if(key == 'company'){	
						if(this.activityForm.get('company').valid){
							let email = this.activityForm.get('company').value;
							this.bodyEmail.push(email);    
							this.activityForm.get('company').reset();
							this.activityForm.get('company').setErrors(null);
						}
					}
				}
			}

			removeBodyEmail(email){
				if(email){
					let i = this.bodyEmail.indexOf(email);
					this.bodyEmail.splice(i,1);
					console.log(this.bodyEmail);
				}
			}

	// On form submit check for valid form
	onSubmit() {
		if (this.activityForm.valid && this.showNext) {
			this.submitDecision();
		} else {
			this.validateAllFormFields(this.activityForm);
			console.log('invalid form');
			console.log(this.activityForm.valid, this.showNext);
			this.screenError = "Please Complete action";
		}
	}

	// on submit post the activity data abd get next activity id
	submitDecision() {
		console.log('submit');
		if(this.group == 2){
			this.actdata={
				config: this.activityForm.value
			}

			this.next = this.activityForm.get('decision').value
		}
		else {
			this.actdata={
				config: this.activityForm.value
			}
			this.next = true

		}		
		if(this.eventId){
		// Post the activity data and get next activity id
		this.workflow.storeProcessActivity(this.eventId,this.activityId,this.actdata).subscribe(updateres=>{
			console.log(updateres)
			// Get the next activity 
			this.workflow.getNextActivity(this.processId, this.activityId, this.next, this.actdata).subscribe(res=>{
				console.log(res);

				// If next process is present in database get next process id and goto next process
				if(res['next_process']){
					this.workflow.getNextProcess(res['next']).subscribe(result=>{
						if(result){
							let eventData = {
								steps: parseInt(this.activityId)+ 1
							}
							this.http.post(this.baseurl+'workflow/updateEvent/'+this.eventId,JSON.stringify(eventData)).subscribe(res=>{
								console.log(res);
							})	
							let activityid=result['activity']
							localStorage.setItem('calling_process',this.processId);
							localStorage.setItem('calling_activity',this.activityId);
							localStorage.setItem('calling_event', this.eventId);
							console.log(localStorage.getItem('calling_process'),localStorage.getItem('calling_activity'));
							let data = {
								company:this.company,
								process:res['next'],
								status:'open'
							}
							this.http.post(this.baseurl+'workflow/storeEvent',JSON.stringify(data)).subscribe(res1=>{
								console.log(res1);
								localStorage.setItem('eventId',res1['id']);          
								this.router.navigateByUrl('/activity/'+this.company+'/'+res['next']+'/'+activityid);

							});

						}
						else{
							this.router.navigateByUrl('/dashboard') 
						}

					})
				}
				// If next process is not present get the next activity Id
				else{	
					this.navigate = <number>res['next'];
					this.stepId = this.stepId + 1;

					// If next activity is null mark process completed and find calling process id
					if (res['next'] == null){
						if(this.is_last){
							let eventData = {
								steps: parseInt(this.activityId)+ 1
							}
							if(!this.callingEvent){
								this.http.post(this.baseurl+'workflow/updateEvent/'+this.eventId,JSON.stringify(eventData)).subscribe(res=>{
									console.log(res);
								})	
							}
							this.http.get(this.baseurl+'workflow/processStatus/'+this.processId).subscribe(res=>{
								console.log(res);
							})

							/*let bmid = localStorage.getItem('bmId');
							if(bmid){
								this.http.get(this.baseurl+'workflow/meetingStatus/'+bmid).subscribe(res=>{
									console.log(res);
								})
								localStorage.removeItem('bmId');
							}*/
							
							let calling_process = localStorage.getItem('calling_process');	
							let calling_act = parseInt(localStorage.getItem('calling_activity'));
							let calling_event = localStorage.getItem('calling_event');
							//console.log(calling_act, calling_process);

							//If calling process present navigate to calling process and activity
							if(calling_process && calling_act){
								localStorage.removeItem('calling_process');
								localStorage.removeItem('calling_activity');
								localStorage.removeItem('bmId');
								localStorage.removeItem('calling_event');
								localStorage.setItem('eventId',calling_event);
								this.meetingSerial=null;
								calling_act+=1;
								// let action = confirm("Process completed");						
								// if (action == true) {
								// 	this.cookie.remove('meetingSerial');
								// 	this.router.navigateByUrl('/activity/'+this.company+'/'+calling_process+'/'+calling_act);    
								// } 
								this.cookie.remove('meetingSerial');
								this.router.navigateByUrl('/activity/'+this.company+'/'+calling_process+'/'+calling_act);    

							}

							//If calling process is not present mark process completed and navigate to dashboard
							else{
								let d = new Date()
								let day = d.getDate();
								let month = d.getMonth()+1;
								let year = d.getFullYear();
								let today = [year,month,day].join('-');
								let action = confirm("Process completed");						
								if (action == true) {
									let eventData = {
										status:'close',
										steps: this.activityId
									}
									this.http.post(this.baseurl+'workflow/updateEvent/'+this.eventId,JSON.stringify(eventData)).subscribe(res=>{
										console.log(res);
									})	
									this.cookie.remove('meetingSerial');
									this.router.navigateByUrl('/dashboard');	
								}
								
							}



						}
					}

					// If next activity id present navigate to next activity
					else{
						let eventData = {
							steps: parseInt(this.activityId)+ 1
						}
						if(!this.callingEvent){
							this.http.post(this.baseurl+'workflow/updateEvent/'+this.eventId,JSON.stringify(eventData)).subscribe(res=>{
								console.log(res);
							})	
						}

						this.formdata.delete("file");

						this.router.navigateByUrl('/activity/'+this.company+'/'+this.processId+'/'+res['next']);
					}
				}

			});
});
}
else{
	this.router.navigateByUrl('/dashboard') 
}

//this.activityForm.reset();


}

handleFileInput(file: FileList){
	console.log(file);
	this.files = file.item(0);
	this.formdata.append("file", this.files, this.files.name);
	this.http.post(this.baseurl+'workflow/uploader/'+this.eventId+'/'+this.activityId,this.formdata).subscribe(res=>{
		console.log(res);
		this.uploadedCompanyDoc = res['id'];
		this.formdata.delete("file");
		this.uploadedFile="file uploaded";
	})

	this.showNext = true;

}


uploadFiles1(id){
	console.log(this.formdata);
	this.http.post(this.baseurl+'workflow/uploader/'+id,this.formdata).subscribe(res=>{
		console.log(res);
	})
}
		//Show uploaded files for agenda, mom, attendance
		showFiles(field,files:string){
			console.log(files);
			let httpParams = new HttpParams()
			.set('field', field)
			.set('fileName', files);
			this.http.get(this.baseurl+'workflow/showAgendaDoc',{params:httpParams, responseType:'blob',observe: 'response'}).subscribe(res=>{
				let filename = res.headers.get('Content-Disposition');
				saveAs(res.body,filename);
			})
		}

		//Upload filling documents
		uploadFilling(name, file:FileList){
			let id = localStorage.getItem('eventId');
			this.files = file.item(0);
			console.log(file);
			this.formdata.append("file", this.files, this.files.name);
			this.http.post(this.baseurl+'workflow/uploadFilling/'+id+'/'+name,this.formdata).subscribe(res=>{
				console.log(res)
				alert(name+ " uploaded");
			});
			this.formdata.delete("file");
			this.showNext = true;
		}		

		// Upload agenda files (ex. Agenda, Attendance sheet, MOM)
		uploadAgendaFiles(name, file: FileList){
			let id = localStorage.getItem('bmId');

			let filename:any;
			let serial:any;
			let agendaType:any;		

			this.files = file.item(0);
			this.formdata.append("file", this.files, this.files.name);
			this.workflow.uploadAgendaDoc(id, name, this.formdata).subscribe(res=>{
				console.log(res);
				filename=res['filename'];
				this.uploadedFile = res['filename'];
				this.meetingSerial = res['serial']['serial'];
				this.displayFile = 'File Uploaded';
				// If uploaded document is Agenda, update notice date and steps
				if(name == 'agenda_doc'){
					let today = new Date()
					let steps = Number(this.id) + 1;
					let data = {notice_date:today,steps:steps};
					
					this.http.post(this.baseurl+'workflow/updateNotice/'+id,JSON.stringify(data)).subscribe(res=>{
						console.log(res);
					})				
					this.showNext = true;
					localStorage.removeItem('currentBm');

				}

				else if(name == 'minutes_of_meeting'){
					if(this.emailto=='director'){
						for(let d of this.directors){
							console.log(d);
							let data ={
								'file':filename,
								'agendaType':'Minutes of Meeting',
								'serial':serial, 
								'company':this.companyName
							};

							// this.http.post(this.baseurl+'workflow/sendToStakeholder/'+d['id'], JSON.stringify(data)).subscribe(res=>{
							// 	console.log(res);
							// },
							// (err:HttpErrorResponse)=>{
							// 	console.log(err)
							// })
						}
					}
					let steps = Number(this.id) + 1;
					console.log(steps);
					let data={steps:steps};

					this.http.post(this.baseurl+'workflow/updateNotice/'+id,JSON.stringify(data)).subscribe(res=>{
						console.log(res);
					})				
					this.email = false;					
					this.http.get(this.baseurl+'workflow/meetingStatus/'+id).subscribe(res=>{
						console.log(res);
					})
					this.showNext = true;

				}
				else{
					let data={steps:Number(this.id) + 1};
					this.showNext = true;

					this.http.post(this.baseurl+'workflow/updateNotice/'+id,JSON.stringify(data)).subscribe(res=>{
						console.log(res);
					})				
				}

			})
			this.formdata.delete("file");
		}

		// Send Agenda to director via email
		sendAgenda(){
			console.log('send');
			let errCode:boolean=false;
			let emailCount = 0;
			let directorCount = this.directors.length;
			let stakeholderCount = this.stakeholders.length;
			let conf:any;
			if(this.uploadedFile){
				if(this.emailSent){
					conf = confirm("Agenda has been sent do you like to send it again");
					if(conf == true){
						if(this.emailto=='director'){
							for(let d of this.directors){
								let directorName= d['first_name']+' '+d['last_name'];
						//console.log(d);
						let data ={'file':this.uploadedFile,'agendaType':this.meeting,'serial':this.meetingSerial,
						'company':this.companyName, 'directorName':this.signingDirector,
						'meetingDate':this.meetingDate,
						'address':this.meetingAddress
					};

					this.http.post(this.baseurl+'workflow/sendToStakeholder/'+d['id'], 
						JSON.stringify(data)).toPromise().then(res=>{
							console.log(res);
						//alert('mail sent to '+directorName);
						emailCount+=1;
						if(!errCode && (emailCount == directorCount)){
							alert("Email send to all directors");
							this.emailSent = true;
						}

					},
					(err:HttpErrorResponse)=>{
						alert('Failed to send mail to '+directorName);
						errCode = true;
						console.log(err)
					})
					}

				}
				if(this.emailto=='stakeholder'){
					let data ={'file':this.uploadedFile,'agendaType':this.meeting,'serial':this.meetingSerial,
					'company':this.companyName, 'directorName':this.signingDirector,
					'meetingDate':this.meetingDate,
					'address':this.meetingAddress
				};
				if(this.bodyEmail.length > 0){
					for(let email of this.bodyEmail){
						console.log(email, this.bodyEmail);
						data['email'] = email;
						this.http.post(this.baseurl+'workflow/sendToStakeholder',
							JSON.stringify(data)).toPromise().then(res=>{
								console.log(res);
								emailCount+=1;
								if(!errCode && (emailCount == stakeholderCount)){
									alert("Email send to all directors and shareholders");
									this.emailSent = true
								}
							},
							(err:HttpErrorResponse)=>{
								alert('Failed to send mail to '+email);
								errCode=true
								console.log(err)
							})
						}

					}
					for(let d of this.stakeholders){
						let directorName= d['first_name']+' '+d['last_name'];
						console.log(d);

						this.http.post(this.baseurl+'workflow/sendToStakeholder/'+d['id'],
							JSON.stringify(data)).toPromise().then(res=>{
								console.log(res);
								emailCount+=1;
								if(!errCode && (emailCount == stakeholderCount)){
									alert("Email send to all directors and shareholders");
									this.emailSent = true
								}
							},
							(err:HttpErrorResponse)=>{
								alert('Failed to send mail to '+directorName);
								errCode=true
								console.log(err)
							})
						}
					}

				}
			}
			else{

				if(this.emailto=='director'){
					for(let d of this.directors){
						let directorName= d['first_name']+' '+d['last_name'];
						//console.log(d);
						let data ={'file':this.uploadedFile,'agendaType':this.meeting,'serial':this.meetingSerial,
						'company':this.companyName, 'directorName':this.signingDirector,
						'meetingDate':this.meetingDate,
						'address':this.meetingAddress
					};

					this.http.post(this.baseurl+'workflow/sendToStakeholder/'+d['id'], 
						JSON.stringify(data)).toPromise().then(res=>{
							console.log(res);
						//alert('mail sent to '+directorName);
						emailCount+=1;
						if(!errCode && (emailCount == directorCount)){
							alert("Email send to all directors");
							this.emailSent = true;
						}

					},
					(err:HttpErrorResponse)=>{
						alert('Failed to send mail to '+directorName);
						errCode = true;
						console.log(err)
					})
					}
				}
				if(this.emailto=='stakeholder'){
					let data ={'file':this.uploadedFile,'agendaType':this.meeting,'serial':this.meetingSerial,
					'company':this.companyName, 'directorName':this.signingDirector,
					'meetingDate':this.meetingDate,
					'address':this.meetingAddress
				};
				if(this.bodyEmail.length > 0){
					for(let email of this.bodyEmail){
						data['email']=email;
						this.http.post(this.baseurl+'workflow/sendToStakeholder',
							JSON.stringify(data)).toPromise().then(res=>{
								console.log(res);
								emailCount+=1;
								if(!errCode && (emailCount == stakeholderCount)){
									alert("Email send to all directors and shareholders");
									this.emailSent = true
								}
							},
							(err:HttpErrorResponse)=>{
								alert('Failed to send mail to '+email);
								errCode=true
								console.log(err)
							})
						}
					}
					for(let d of this.stakeholders){
						let directorName= d['first_name']+' '+d['last_name'];
						console.log(d);

						this.http.post(this.baseurl+'workflow/sendToStakeholder/'+d['id'],
							JSON.stringify(data)).toPromise().then(res=>{
								console.log(res);
								emailCount+=1;
								if(!errCode && (emailCount == stakeholderCount)){
									alert("Email send to all directors and shareholders");
									this.emailSent = true
								}
							},
							(err:HttpErrorResponse)=>{
								alert('Failed to send mail to '+directorName);
								errCode=true
								console.log(err)
							})
						}

					}
				}
				this.email = true;
			}
			else{
				alert('Upload file first');
				this.screenError = 'Upload file first';
				this.email = false;
			}

		// localStorage.removeItem('currentBm');
	}

	navigateActivity(stepId){
		this.router.navigateByUrl('/activity/'+this.company+'/'+this.processId+'/'+stepId);		
		$('#workflow-steps-listing-modal').modal('hide')
	}

	// Get the next activity on (>>) button
	nextActivity(){
		console.log(this.stepId, this.lastActivity);
		if(this.stepId < this.lastActivity){
			this.nextNav = this.id*1+1;
			this.stepId = this.stepId+1;
			console.log(this.stepId);

			this.router.navigateByUrl('/activity/'+this.company+'/'+this.processId+'/'+this.nextNav);
		}
		else{
			this.router.navigateByUrl('/activity/'+this.company+'/'+this.processId+'/'+this.id);
			alert("Last Activity");
		}
	}

	// Get the previous activity on (<<) button
	previousActivity(){
		if(this.stepId > 1){			
			this.preNav = this.id - 1;
			this.stepId = this.stepId-1;
			console.log(this.stepId);

			this.router.navigateByUrl('/activity/'+this.company+'/'+this.processId+'/'+this.preNav);
		}
		else{
			this.router.navigateByUrl('/activity/'+this.company+'/'+this.processId+'/'+this.id);	
			alert("First Activity");
		}
	}

	setPage(page: number) {
		if (page < 1 || page > this.pager.totalPages) {
			return;
		}
        // get pager object from service
        this.pager = this.pagerService.getPager(this.lastActivity, page);
        console.log(this.pager, this.lastActivity, page);
    }


}

