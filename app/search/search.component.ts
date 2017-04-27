import { Component, OnInit } from '@angular/core';
import {  SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [ SearchService ]
})
export class SearchComponent implements OnInit {
  club_name: string
  clubresults = []
  long: number 
  lat: number
  res = []
  constructor(private searchService: SearchService) { }

  ngOnInit() {
  }

  myLocation(){
    var location = JSON.parse(localStorage.getItem('address'));
    this.long = location.longitude;
    this.lat = location.latitude;
  }

  search(){
    if(this.club_name){
      //console.log(this.club_name)
      this.searchService.getClubsByName(this.club_name).subscribe(
        (res)=> {
          this.clubresults = []
          //for(res[0].member.clubs[0].name)
          for(let r of res.json())
            for(let club of r.member.clubs)
              if(club.name == this.club_name) 
                this.clubresults.push(club)
          //this.res = res.json()
          console.log(this.clubresults)
        }
      );
    }
  }
  
}
