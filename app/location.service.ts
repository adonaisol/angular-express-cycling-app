import { Injectable }        from '@angular/core';
import { Http }              from '@angular/http';
import { Observable }        from 'rxjs'
@Injectable()
export class LocationService {
  
  constructor(public http: Http) { 
    
  }
  getPosition() {
     let address: any;
     navigator.geolocation.getCurrentPosition((position)=>{
        console.log('Longitude:' + position.coords.longitude );
        console.log('Latitude:' + position.coords.latitude );
        this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyBWYitRFH0D6xwEaYazMLlfkkjNCEmxdWI`).subscribe(response=>{
            //alert(JSON.stringify(response.json()));
            address = {'city': response.json().results[0].address_components[1].long_name, 
                       'state': response.json().results[0].address_components[3].short_name,
                       'longitude': position.coords.longitude,
                       'latitude': position.coords.latitude
                    }
            localStorage.setItem('address', JSON.stringify(address));
            //alert(address);
        })   
     },
     (msg)=>{
        console.log(msg);
     })
     
  }
  
  public getCity(long, lat){
    let address: any;
    this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=AIzaSyBWYitRFH0D6xwEaYazMLlfkkjNCEmxdWI`).subscribe(response=>{
        alert(JSON.stringify(response.json()));
        address = {'city': response.json().results[0].address_components[1].long_name, 'state': response.json().results[0].address_components[3].short_name}
        //console.log(address);
    })
    return address;
  }
}
