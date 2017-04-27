import { Component, OnInit } from '@angular/core';
import {EventService} from '../service/event.service';
import { ActivatedRoute } from "@angular/router"
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  providers: [EventService]
})
export class EventsComponent implements OnInit {
  events: Object;
  member_id: string;
  constructor(private eventService: EventService, private activatedRoute: ActivatedRoute) {
     this.activatedRoute.params.subscribe(
      (param: any) => {
        this.member_id = param['member_id'];
        console.log(this.member_id);
      })
      
   }

  ngOnInit() { 
    console.log(this.member_id);
       this.eventService.getEvents(this.member_id).subscribe((res) => { this.events = res.json(); console.dir(this.events) })       
  }
  
}
