import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http'; 
@Injectable()
export class SearchService {
  constructor(public http: Http) {
    
   }

  getClubsByName(name){    
    return this.http.get('http://localhost:4000/search/clubs/' +name)
  }

  getClubsByNumberOfMembers(){    
    return this.http.get('http://localhost:4000/search/clubs/numberOfMembers')
  }

  getCubsByLocation(){
    //return this.http.get('http://jsonplaceholder.typicode.com/posts?userId=1')
  }

}