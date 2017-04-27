import {UserComponent} from './user/user.component';
import {AppComponent} from './app.component';
import {ClubsComponent} from './clubs/clubs.component';
import {UsersdetailComponent} from './userdetail/usersdetail.component';
import { RouterModule, Routes } from "@angular/router";
import { EventsComponent} from './events/events.component';
import {EventComponent} from './event/event.component';
import {AnnouncementComponent} from './announcement/announcement.component';
import { HomeComponent }               from './home.component';
import { AuthGuard }                   from './auth.guard.service';

const ROUTES = [   
    { path: '', component: HomeComponent, children: [
        {path: 'users', component: UserComponent},
        {path: 'userdetails/:member_id', component: UsersdetailComponent},
        {path: 'event', component: EventsComponent },
        {path: 'event/create/:member_id', component: EventComponent},
        {path: 'announcement/create/:member_id', component: AnnouncementComponent},
        {path: 'create/club/:member_id', component: ClubsComponent}
    ] },
    
    { path: '**', redirectTo: '', canActivate: [AuthGuard] }
]

export const myRoutes = RouterModule.forRoot(ROUTES);