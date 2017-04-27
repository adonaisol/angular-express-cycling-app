import { Component, OnInit, AfterContentInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../service/event.service';
import { ClubService } from '../service/club.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css'],
  providers:[ClubService, EventService]
})
export class AnnouncementComponent implements OnInit {
member_id:string;
myForm: FormGroup;
clubs: Object[];
  constructor(private clubService: ClubService, private activatedRoute: ActivatedRoute, fb:FormBuilder) { 
     this.activatedRoute.params.subscribe(
      (param: any) => {
        this.member_id = param['member_id'];
        console.log(this.member_id);
      })
      this.myForm = fb.group({
         msg:[''],
         title:[''],
         club:['']
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
  submitForm(form){
    let msg = {
              message: form.value.msg,      
              title: form.value.title,
              date: new Date().toDateString(),
              club_name: form.value.club,
              member_id: this.member_id
            }
    console.log(form.value.msg);
    console.log(form.value.title);
    console.log(form.value.club);
    this.clubService.createAnnoucement(msg).subscribe((res) => console.log(res));
  }

}
