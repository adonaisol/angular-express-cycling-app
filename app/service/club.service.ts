import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http"
import {Observable} from "rxjs";
import {RequestOptions} from '@angular/http';
import {Headers} from '@angular/http';

@Injectable()
export class ClubService {
  constructor(private http : Http){}

// get all the clubs for a cyclist based on location
  getAllClubs(latitude: number, longitude: number) {
     return  this.http.get('http://localhost:4000/cyclists/club/' + latitude +'/' +longitude);
  }
  // get club using the name of the club
  getClub(name: string) :Observable<Response> | boolean {
    return this.http.get('http://localhost:4000/cyclists/clubs/' + name);
  }
  // create new club for a user
  createClub(club:Object)  {
     return this.http.post('http://localhost:4000/cyclist/newClub', club); 
  }

// delete club using clubId
  deleteClub(name: string) :Observable<Response> | boolean {
    return this.http.get('http://localhost:4000/cyclist/delete/club/' + name);
  }

  //get clubs for a member
  getClubForMember(member_id: string){
     return this.http.get('http://localhost:4000/cyclists/clubs/member/' + member_id);
  }

  createAnnoucement(announcemnet: object){
      let headers = new Headers({'Content-Type': 'application/json'});  
    //headers.append('Authorization','Bearer')
    let options = new RequestOptions({headers: headers});
      return this.http.post('http://localhost:4000/cyclists/clubs/newAnnouncement', announcemnet);
  }
 
}
