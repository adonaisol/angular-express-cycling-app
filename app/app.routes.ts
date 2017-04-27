import { ModuleWithProviders }         from '@angular/core';
import { Routes, RouterModule }        from '@angular/router';

import { HomeComponent }               from './home.component';
import { AuthGuard }                   from './auth.guard.service';


const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: '**', redirectTo: '', canActivate: [AuthGuard] }
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);