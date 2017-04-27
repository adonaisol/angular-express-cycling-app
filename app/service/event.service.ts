import {Injectable, EventEmitter} from "@angular/core";
import {Http, Response} from "@angular/http"
import {Observable} from "rxjs";
import {Headers} from '@angular/http';
import {RequestOptions} from '@angular/http';


@Injectable()
export class EventService {
  //eventData: EventEmitter<string>;
  constructor(private http : Http){}

// get events for a given user based on current location
  testEvent(event: object){
    return  this.http.post('http://localhost:4000/test', event )
  }
  getAllEvents(latitude: number, longitude: number) {
     return  this.http.get('http://localhost:4000/cyclists/events/' + latitude +'/' +longitude);
  }
  //get events for a given user
  getEvents(member_id: string)  {
     return this.http.get('http://localhost:4000/cyclists/clubs/events/' + member_id);
  }
  // create a new event
  createEvent(event:Object){
    console.log(JSON.stringify(event));
    let headers = new Headers({'Content-Type': 'application/json'});  
    //headers.append('Authorization','Bearer')
    let options = new RequestOptions({headers: headers});
    //console.log("path"+path);
     return this.http.post('http://localhost:4000/cyclist/clubs/events', event)// options)
    //  .subscribe(
    //    (response)=>console.log(response)
    //  ); 
  }

// delete an event for user
  deleteEvent(name: string) :Observable<Response> | boolean {
    return this.http.get('http://localhost:4000/cyclist/clubs/events/delete/' + name);
  }


 
}
