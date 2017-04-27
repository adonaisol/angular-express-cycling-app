import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http"
import {Observable} from "rxjs";


@Injectable()
export class UserService {
  constructor(private http : Http){}
  //get all the cyclists
  getAllCyclists()  {
     return  this.http.get('http://localhost:4000/cyclists');
  }
  //get cyclist
  getCyclist(member_id: string){
    return this.http.get('http://localhost:4000/cyclists/' + member_id);
  }
  //create new cyclist
  createCyclist(cyclist:Object) :Observable<Response> | boolean {
     return this.http.post('http://localhost:4000/cyclist/newCyclist', cyclist); 
  }
  //delete cyclist
  deleteCyclist(member_id: string) :Observable<Response> | boolean {
    return this.http.get('http://localhost:4000/cyclist/delete/member/' + member_id);
  }


 
}
