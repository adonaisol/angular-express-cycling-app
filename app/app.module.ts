import { NgModule }            from '@angular/core';
import { FormsModule, ReactiveFormsModule }         from '@angular/forms';
import { BrowserModule  }      from '@angular/platform-browser';
//import { AUTH_PROVIDERS }      from 'angular2-jwt';
import { HttpModule, Http }                from '@angular/http'

import {myRoutes}              from './routes';
import { AppComponent }        from './app.component';
import { HomeComponent }       from './home.component';

import {ChatComponent} from './chat/chat.component';
import { SearchComponent } from './search/search.component';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { UserComponent } from './user/user.component';
import { ClubsComponent } from './clubs//clubs.component';
import { UsersdetailComponent } from './userdetail/usersdetail.component';
import { EventsComponent } from './events/events.component';
import { EventComponent } from './event/event.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { MypageComponent } from './mypage/mypage.component';
@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SearchComponent,
        UserComponent,
        ClubsComponent,
        UsersdetailComponent,
        EventsComponent,
        EventComponent,
        AnnouncementComponent,
        MypageComponent,
        ChatComponent
    ],
    providers:    [
       
        //AUTH_PROVIDERS
       
    ],
    imports: [
        myRoutes,
        ReactiveFormsModule,      
        BrowserModule,
        
        HttpModule,
        FormsModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyA2o3HiIazxD2-ehabGqOEFNdIPr2Isg7o'
        })
    ],
    bootstrap:    [AppComponent],
})
export class AppModule {}
