import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '../service/authentication.service';
import { AlertService } from '../service/alert.service';

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
        private alertService: AlertService
    ) {
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
          console.log(this.authenticationService.currentUserValue);
            //this.router.navigate(['/']);
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

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Login successful', true);
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error.error);
                    this.loading = false;
                });
    }
}



// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-login-form',
//   templateUrl: './login-form.component.html',
//   styleUrls: ['./login-form.component.css']
// })
// export class LoginFormComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
