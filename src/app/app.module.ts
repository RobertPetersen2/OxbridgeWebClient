import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsModule } from '@angular/google-maps'
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './stuff/jwt.interceptor';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { RegisterFormComponent } from './register-form/register-form.component';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamMemberPendingApprovalsComponent } from './team-member-pending-approvals/team-member-pending-approvals.component';
import { EnrollParticipantComponent } from './enroll-participant/enroll-participant.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RacesComponent } from './races/races.component';
import { RaceEditorComponent } from './race-editor/race-editor.component';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginFormComponent,
    RegisterFormComponent,
    TeamListComponent,
    TeamMemberPendingApprovalsComponent,
    EnrollParticipantComponent,
    RacesComponent,
    RaceEditorComponent,
    AlertComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatSelectModule,
    MatInputModule,
    BrowserAnimationsModule,
    MDBBootstrapModule.forRoot(),
    NgbModule,
    GoogleMapsModule,
    ScrollingModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    HttpClientModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
        JwtHelperService
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
