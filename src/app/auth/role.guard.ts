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
    // Gets the token from our auth service
    const token = currentUser.token
    // decode the token to get its payload
    const tokenPayload = decode(token);
    // Since we use true or false and not define a role to grand access
    // we will fetch the value (true or false) that is in isAdmin or isTeamLeader and later compare it if it's true or false
    const fetchedRole = tokenPayload[expectedRole];
    

    //####################################################//
    // ADMIN OVERRIDE as long as the user is an ADMIN he will be able to access 
    // all pages that are restricted with a role lower than admin!
    //####################################################//
    if (
      this.authenticationService.isAuthenticated() &&
      tokenPayload.isAdmin === true
    ) {
      return true;
    }
    //####################################################//


    // Normal Role handler
    if (
      !this.authenticationService.isAuthenticated() || 
      fetchedRole !== true
    ) {
      this.alertService.error('You have no permissions to view this page ' + "'" + state.url + "'", true);
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
      return false;
    }

    // Else grand access
    return true;
  }


}