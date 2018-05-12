import { Injectable} from '@angular/core';


@Injectable()
export class NavbarService{

visible: boolean;
visibleLogin: boolean;
userName: any;

  constructor() { this.visible = false; this.visibleLogin = false; this.userName=localStorage.getItem('userName');}




  hide() { this.visible = false; }

  hideLogin(){this.visibleLogin=false;}

  show() { this.visible = true;}

  showLogin(){this.visibleLogin=true;}

  //toggle() { this.visible = !this.visible; }

}
