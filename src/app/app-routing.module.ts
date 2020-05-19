import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamMemberPendingApprovalsComponent } from './team-member-pending-approvals/team-member-pending-approvals.component';
import { EnrollParticipantComponent } from './enroll-participant/enroll-participant.component';

const routes: Routes = [      //Roters is then you click under the menu bar button , its connected to "page"
  
  { path: 'home',        component: HomeComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: 'login-form',        component: LoginFormComponent },
  { path: 'register-form',        component: RegisterFormComponent },
  { path: 'team-list',        component: TeamListComponent  },
  { path: 'enroll-participant',        component: EnrollParticipantComponent  },
  { path: 'team-member-pending-approvals',        component: TeamMemberPendingApprovalsComponent  }
];


// , canActivate: [AuthGuard] 
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }