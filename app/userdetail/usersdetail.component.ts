import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute } from "@angular/router"
import { Subscription } from "rxjs/Rx";
@Component({
  selector: 'app-usersdetail',
  templateUrl: './usersdetail.component.html',
  styleUrls: ['./usersdetail.component.css'],
  providers: [UserService]
})
export class UsersdetailComponent implements OnInit {
  private subscription: Subscription;
  member_id: string;
  user: object;

  constructor(private userService: UserService, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(
      (param: any) => {
        this.member_id = param['member_id'];
        console.log(this.member_id);
      })
  }

  ngOnInit() {

    this.userService.getCyclist(this.member_id).subscribe(
      (res) => {
        this.user = res.json().data; console.dir(this.user)
      });

    // console.log(this.user);
  }

}
