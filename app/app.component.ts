import { Component }         from '@angular/core';
import { Auth }              from './auth.service';
import { LocationService }   from './location.service';
import { ClubService }       from './service/club.service'

@Component({
    selector: 'my-app',
    styleUrls: ['./app.template.css'],
    templateUrl: './app.template.html',
    providers: [ Auth, LocationService, ClubService ]
})

export class AppComponent {

  constructor(private auth: Auth, private loc: LocationService) {}
  login() {
    this.auth.login();
    
  }
  logout() {
    this.auth.logout();
    localStorage.clear();
  }
  userDetails: Object;
  userLocation: Object = {};
  ngOnInit(){
    this.userDetails = JSON.parse(this.auth.getData());
    //console.log(this.userDetails);
    if(localStorage.getItem('address')){
        this.userLocation = JSON.parse(localStorage.getItem('address'));
    }
    else {
      this.loc.getPosition()
    }
  }
};

