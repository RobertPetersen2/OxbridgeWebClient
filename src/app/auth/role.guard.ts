import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';

import decode from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(public authenticationService: AuthenticationService, public router: Router, private alertService: AlertService) {}


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    let currentUser = this.authenticationService.currentUserValue;
    // const token = localStorage.getItem('currentUser');
    const token = currentUser.token
    // decode the token to get its payload
    const tokenPayload = decode(token);
    const fetchedRole = tokenPayload[expectedRole];

    console.log(fetchedRole);
    
    if (
      !this.authenticationService.isAuthenticated() || 
      fetchedRole !== true
    ) {
      this.alertService.error('You have no permissions to view this page ' + "'" + state.url + "'", true);
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
      return false;
    }
    return true;
  }


}