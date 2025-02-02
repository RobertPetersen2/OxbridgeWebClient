import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';
import { EnrollmentService } from '../service/enrollment.service';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
  })
export class LoginFormComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private enrollmentService:EnrollmentService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
          console.log(this.authenticationService.currentUserValue);
            this.router.navigate(['/']);    //Can be modified to redirect to a specific page
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if the login-form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;    // Shows loading animation
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Login successful', true);    // Show alert message

                    // Reload enrollment status for new user, so that we don't display enrollment status for previous user
                    this.enrollmentService.getStatus();

                    this.router.navigate([this.returnUrl]);     // Navigate to the selected return Url
                },
                error => {
                    
                    this.alertService.error(error.error.message);   // gets the error message from the backend response & shows it as alert message
                    this.loading = false;   // Hides error message
                });
    }
}
