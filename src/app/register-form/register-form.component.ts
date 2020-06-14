import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { RegisterService } from '../service/register.service';
import { AlertService } from '../service/alert.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private alertService: AlertService
  ) { 

  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.pattern('^([A-Z][a-z]*((\\s[A-Za-z])?[a-z]*)*)$')]],
      username: ['', [Validators.required, Validators.minLength(2)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      isTeamLeader: [''],
      team: ['', [Validators.minLength(6)]]
  });
  }

  // convenience getter for easy access to the register-form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }

    this.loading = true;  // Shows loading animation
    this.registerService.register(this.registerForm.value)
        .pipe(first())
        .subscribe(
            data => {
                this.alertService.success('Registration successful', true);   // Show alert message
                this.router.navigate(['/login-form']);   // After login, redirect to login page
                console.log(data);
            },
            error => {
                this.alertService.error(error.error);   // gets the error message from the backend response & shows it as alert message
                this.loading = false;   // Hides loading animation
                console.log(error);
            });
  }
}
