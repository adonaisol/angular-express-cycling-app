import { Component, OnInit  }  from '@angular/core';
import { Auth }       from './auth.service';
import { ClubService }  from './service/club.service'
import {UserService} from './service/user.service';


@Component({
  selector: 'home',
  template: `
  <div *ngIf="auth.authenticated()">
  <div class="col-md-2">
    <div class="panel panel-danger clubs">
      <div class="panel-heading">My Clubs</div>
      <h5 *ngFor = "let club of myclub" (click)="load()">{{club}}</h5>
    </div>
    <div class="panel panel-danger clubs">
    <div class="panel-heading">Clubs Near Me</div>
      <h5 *ngFor = "let club of clubs" >{{club}}</h5>
    </div>
  </div>
  <div *ngIf="set" class="col-md-8 well">
    <a (click)="unload()">Home</a>
    <app-mypage></app-mypage>
  </div>
  <div *ngIf="!set" class="col-md-8">
    <app-search></app-search>
    <div class="clearfix"></div>
    
    <div class="img-center">
    <sebm-google-map [latitude]="lat" [longitude]="long" [zoom]="14" [zoomControl]="false">
      <sebm-google-map-marker [latitude]="lat" [longitude]="long"></sebm-google-map-marker>
      <sebm-google-map-marker 
          *ngFor="let m of markers; let i = index"
          (markerClick)="clickedMarker(m.label, i)"
          [latitude]="m.lat"
          [longitude]="m.lng"
          [label]="m.label"
          [markerDraggable]="m.draggable"
          (dragEnd)="markerDragEnd(m, $event)">
          
        <sebm-google-map-info-window>
          <strong>{{m.club}}</strong>
          <p>{{m.event}}</p>
        </sebm-google-map-info-window>
        
      </sebm-google-map-marker>
    </sebm-google-map>
    </div>
  </div>
  <div class="col-md-2">
  <div class="panel panel-success message">
    <div class="panel-heading">Users Online</div>
    <div class="panel-body">
       <h5 *ngFor="let user of users" (click)=message(user.member.name)>
         <a [routerLink]="['/userdetails', user.member.member_id]" >{{user.member.name}}</a>
        </h5> 
    </div>
  </div>
  <div class="panel panel-success message">
    <div class="panel-heading" id="msgHead">Messaging</div>
    <div class="panel-body">
     <chat></chat>
    </div>
  </div>
  </div>
  </div>
  `,
  styles: ['.clubs{min-height: 200px}', '.message{min-height: 250px; background-color: #f6f6f6}', 
  '.sebm-google-map-container {height: 350px;}', 
  'h5{padding: 15px; border-bottom: 1px solid gray; margin: 0 auto}', 'h5:hover{background-color: lightgray; cursor: pointer; font-weight: bold}',
  '#msgHead .panel-body{overflow-y: scroll}'],
  providers: [UserService]
})

export class HomeComponent {
   long: number; lat: number; clubs: any []; myclub: any []; users: object[]
   clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
    }
   markers : any; set: number = 0;
   constructor(private auth: Auth, private club: ClubService, private userService: UserService) {}
   ngOnInit(){
     this.lat = JSON.parse(localStorage.getItem("address")).latitude;
     this.long = JSON.parse(localStorage.getItem("address")).longitude;
     this.userService.getAllCyclists().subscribe((res) => { this.users = res.json(); console.dir(this.users) });
     this.getClubs(this.lat, this.long)
   }
   load(){
     this.set = 1;
   }
   unload(){
    this.set  = 0;
   }
   message(user){
     document.getElementById('msgHead').innerText = "Messaging: " + user;
   }
   getClubs(lat, lng){
      this.club.getAllClubs(lat, lng).subscribe((res)=>{
        //console.log(res.json())
        this.clubs = res.json()
        this.markers = [
        	  {
        		  lat: 41.01,
        		  lng: -91.96,
        		  label: 'A',
        		  draggable: false,
              name: this.clubs[0],
              club: 'Awesome Group',
              event: 'Fun Ride'
        	  },
        	  {
        		  lat: 41.016651,
        		  lng: -91.958925,
        		  label: 'B',
        		  draggable: false,
              name: this.clubs[1],
              club: 'Group5',
              event: 'Bike Till You Sweat'
        	  },
        	  {
        		  lat: 42.723858,
        		  lng: 7.895982,
        		  label: 'C',
        		  draggable: false,
              name: this.clubs[0]
        	  }
          ]
          for(let marker of this.markers){
            var a = (Math.random()/10000) * (Math.random() < 0.5 ? -1 : 1)
            var b = (Math.random()/10000) * (Math.random() < 0.5 ? -1 : 1)
            setInterval(()=>{
                  marker.lat += a
                  marker.lng -= b
            },1000)
          }
          this.myclub = [this.clubs[0], this.clubs[2]]
      })
   }
};
