import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './service/authentication.service';
import { AlertService } from './service/alert.service';
import { User } from './models/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'OxbridgeProject';

  currentUser: User;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.alertService.success('You have been logged out', true);
        this.router.navigate(['/login-form']);
    }

}
