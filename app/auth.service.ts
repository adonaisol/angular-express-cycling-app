import { Injectable }      from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { myConfig }        from './auth.config';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class Auth {
  // Configure Auth0
  lock = new Auth0Lock(myConfig.clientID, myConfig.domain, {});

  constructor() {
    // Add callback for lock `authenticated` event
    this.lock.on('authenticated', (authResult) => {
      localStorage.setItem('id_token', authResult.idToken);
      this.lock.getUserInfo(authResult.accessToken, function(error, profile){
           localStorage.setItem('profile', JSON.stringify(profile));
           console.log(profile);
           location.reload();
      })
    });
  }

  public login() {
    // Call the show method to display the widget.
    this.lock.show((error: string, profile: Object, id_token: string) => {
     if (error) {
       console.log(error);
     }
     // We get a profile object for the user from Auth0
     //alert(profile)
     //localStorage.setItem('profile', JSON.stringify(profile));

     
     // We also get the user's JWT
     localStorage.setItem('id_token', id_token);
   });
  };

  public authenticated() {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired('id_token');
  };

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem('id_token');
    localStorage.removeItem('address');
  };

  public getData(){
    return localStorage.getItem('profile');
  }

  public printData(){
    alert(localStorage.getItem('profile'));
  }
}
