import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
import { VerifyComponent } from './verify/verify';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard';
import { PublicProfileComponent } from './public-profile/public-profile';
export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'perfil/:nome', component: PublicProfileComponent },
  

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'dashboard', component: DashboardComponent },
  

  { path: '**', redirectTo: '' },
  
];
