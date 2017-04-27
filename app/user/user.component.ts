import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [UserService]
})
export class UserComponent implements OnInit {
  users: Object[];
  constructor(private userService: UserService) {
   
   }

  ngOnInit() {
    this.userService.getAllCyclists().subscribe((res) => { this.users = res.json(); console.dir(this.users) });
  }

}
