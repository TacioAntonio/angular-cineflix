import { Routes } from '@angular/router';

import { SignInComponent } from './components/sign-in/sign-in.component';
import { HomeComponent } from './components/home/home.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { MyMovieListComponent } from './components/my-movie-list/my-movie-list.component';
import { AuthenticateGuard } from './shared/guards/authenticate.guard';
import { Error404Component } from './core/components/error404/error404.component';
import { AuthorizationGuard } from './shared/guards/authorization.guard';

export const routes: Routes = [
  {
    path: 'my-movie-list/:id',
    component: MyMovieListComponent,
    canActivate: [AuthenticateGuard]
  },
  {
    path: 'home/:id',
    component: HomeComponent,
    canActivate: [
      AuthenticateGuard,
      AuthorizationGuard
    ]
  },
  {
    path: 'profiles',
    component: ProfilesComponent,
    canActivate: [AuthenticateGuard]
  },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: '**', component: Error404Component }
];
