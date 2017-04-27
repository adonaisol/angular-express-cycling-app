import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ClubService } from '../service/club.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.css'],
  providers: [ClubService]
})
export class ClubsComponent implements OnInit {
  myForm: FormGroup;
  member_id: string;
  constructor(private fb: FormBuilder, private clubService: ClubService, activatedRoute: ActivatedRoute) {
     activatedRoute.params.subscribe(
      (param: any) => {
        this.member_id = param['member_id'];
        console.log(this.member_id);
      })
     this.myForm = fb.group({
      name: [''],
      phone: [''],
      long:[''],
      lati:[''],
      city:[''],
      state:['']
    });
   }


submitForm(form){    
  let club =  {      
      name: form.value.name,
      phone: form.value.phone,
      member_id: this.member_id,      
      location: {
        latitude: form.value.lati,
        longitude: form.value.long,
        city: form.value.city,
        state: form.value.state
      }      
  }
  console.log(form.value.img.value);
  this.clubService.createClub(club).subscribe((res) => { console.log(res.json())})
}

  ngOnInit() {
  }


}
