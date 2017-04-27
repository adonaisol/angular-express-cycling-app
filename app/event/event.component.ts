import { Component, OnInit, AfterContentInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../service/event.service';
import { ClubService } from '../service/club.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
  providers: [EventService, ClubService]
})
export class EventComponent implements OnInit, AfterContentInit {
  member_id: string;
  myForm: FormGroup;
  clubs: Object[];
  constructor(private eventService: EventService, private activatedRoute: ActivatedRoute, fb: FormBuilder, private clubService: ClubService) {
    this.activatedRoute.params.subscribe(
      (param: any) => {
        this.member_id = param['member_id'];
        console.log(this.member_id);
      })
    this.myForm = fb.group({
      name: [''],
      strlat: [''],
      strlong: [''],
      endlat: [''],
      endlong: [''],
      club: ['']
    });

  }
  ngOnInit() {
     this.clubService.getClubForMember(this.member_id).subscribe(
       (res) => {
         let members = res.json();
         this.clubs = members[0].member.clubs;        
      }
    );
  }
  ngAfterContentInit() {
   
  }
  submitForm(form) {
    console.log(form.value.name);
    let event =
      {
        name: form.value.name,
        start_location: {
          latitude: form.value.strlat,
          longitude: form.value.strlong
        },
        end_location: {
          latitude: form.value.endlat,
          longitude: form.value.endlong
        },
        date: new Date().toDateString(),
        owner: {
          memeber_id: this.member_id,
          member_name: form.value.name
        },
        status: "Scheduled",
        flag: {
          isSet: false
        },
        member_id: this.member_id,
        club_name: form.value.club
      }
    this.eventService.createEvent(event).subscribe((res) => { console.log(res.json()) });

  }


}
