import { BrowserModule } from '@angular/platform-browser';
import { NgxGaugeModule } from 'ngx-gauge';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormlyModule } from '@ngx-formly/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CookieService } from 'ngx-cookie-service';
import {CookieModule} from 'ngx-cookie';
import { Select2Module } from 'ng4-select2';
import { NgProgressModule, NgProgressInterceptor } from 'ngx-progressbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { AuthService } from './services/auth.service';
import { UrlserviceService } from './services/urlservice.service';
import { CompanyService } from './services/company.service';
import { NavbarService } from './services/navbar.service';
import { PagerService } from './services/pager.service';
import { WorkflowService } from './services/workflow.service';
import { EnsureAuthenticatedService } from './services/ensure-authenticated.service';
import { LoginRedirectService } from './services/login-redirect.service';
import { CreateCompany1Component } from './components/company-creation/create-company1/create-company1.component';
import { CreateCompany2Component } from './components/company-creation/create-company2/create-company2.component';
import { CreateCompany3Component } from './components/company-creation/create-company3/create-company3.component';
import { CreateCompany4Component } from './components/company-creation/create-company4/create-company4.component';
import { CreateCompany5Component } from './components/company-creation/create-company5/create-company5.component';
import { WorkflowLogComponent } from './components/workflow/workflow-log/workflow-log.component';

import { SupportComponent } from './components/support/support.component';
import { FaqsComponent } from './components/faqs/faqs.component';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FeaturesComponent } from './components/features/features.component';
import { ContactComponent } from './components/contact/contact.component';
import { ActivityComponent } from './components/workflow/activity/activity.component';
import { ResetComponent } from './components/reset/reset.component';
import { AddEventComponent } from './components/add-event/add-event.component';
import { MeetingLogComponent } from './components/workflow/meeting-log/meeting-log.component';
import { SearchPipe } from './filters/search.pipe';
import { CsInterceptor } from './services/cs-interceptor';

import { EventLogComponent } from './components/workflow/event-log/event-log.component';
import { CompanyComponent } from './components/company/company.component';

import { routerConfig } from './router.config';
import { ExistingCompanyComponent } from './components/company-creation/existing-company/existing-company.component';
import { SearchCompanyComponent } from './components/company-creation/search-company/search-company.component';
import { IncorporatedCompanyComponent } from './components/company-creation/incorporated-company/incorporated-company.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    CreateCompany1Component,
    CreateCompany2Component,
    CreateCompany3Component,
    CreateCompany4Component,
    CreateCompany5Component,
    WorkflowLogComponent,
    
    SupportComponent,
    FaqsComponent,
    ProfileComponent,
    NavbarComponent,
    FeaturesComponent,
    ContactComponent,
    ActivityComponent,
    ResetComponent,
    AddEventComponent,
    MeetingLogComponent,
    SearchPipe,
    
    EventLogComponent,
    
    CompanyComponent,
    
    ExistingCompanyComponent,
    
    SearchCompanyComponent,
    
    IncorporatedCompanyComponent
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxGaugeModule,
    FormlyModule.forRoot(),
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    BrowserAnimationsModule,
    Select2Module,
    NgProgressModule,
    MatProgressSpinnerModule,
    CookieModule.forRoot(),
    NgbModule.forRoot(),
  //  MaterialModule,
    RouterModule.forRoot(routerConfig)
  ],
  providers: [
  AuthService,
  CompanyService,
  EnsureAuthenticatedService,
  LoginRedirectService,
  NavbarService,
  CookieService,
  UrlserviceService,
  WorkflowService,
  PagerService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: CsInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: NgProgressInterceptor,
    multi: true
  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
