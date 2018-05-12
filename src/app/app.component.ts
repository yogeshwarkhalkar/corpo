import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarService } from './services/navbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
	constructor(private http: HttpClient, private router: Router, private nav: NavbarService, private loc: Location) { 
		if (loc.path() == '/login' || loc.path() == ''){
		this.nav.showLogin();
		this.nav.hide();
		}
		else{
			this.nav.show();
			this.nav.hideLogin();
		}
	}
	ngOnInit(){


	}
  
}

