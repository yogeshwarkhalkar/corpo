import { Routes } from '@angular/router';
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
import { ExistingCompanyComponent } from './components/company-creation/existing-company/existing-company.component';
import { SearchCompanyComponent } from './components/company-creation/search-company/search-company.component';

export const routerConfig : Routes = [
	{
        path: 'support',
        component: SupportComponent
      },
      {
        path: 'faqs',
        component: FaqsComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'features',
        component: FeaturesComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path:'contact',
        component: ContactComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [LoginRedirectService]
      },
      {
        path:'reset/:id',
        component: ResetComponent        
      },
      {
        path: 'dashboard',
       component: DashboardComponent,
       canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'selectCompany',
        component: ExistingCompanyComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'searchCompany',
        component: SearchCompanyComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'createCompany1',
        component: CreateCompany1Component,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'createCompany2',
        component: CreateCompany2Component,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'createCompany3',
        component: CreateCompany3Component,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'createCompany4',
        component: CreateCompany4Component,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'createCompany5',
        component: CreateCompany5Component,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'workflowlog',
        component: WorkflowLogComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'meetinglog/:id/:status',
        component: MeetingLogComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'eventlog/:id/:status',
        component: EventLogComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path : 'activity/:id',
        component: ActivityComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path : 'activity/:company/:process/:id',
        component: ActivityComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'events/:company',
        component: AddEventComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'selectCompany/:type/:status',
        component: CompanyComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
        path: 'selectCompany/:type',
        component: CompanyComponent,
        canActivate: [EnsureAuthenticatedService]
      },
      {
      	path : '',
      	pathMatch : 'full',
      	redirectTo : '/dashboard'
      },
      {
      	path : '**',
      	pathMatch : 'full',
      	redirectTo : '/dashboard'
      }
];