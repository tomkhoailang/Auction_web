import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  RegisterForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private toast: NgToastService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.RegisterForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,20}$/
          ),
        ],
      ],
    });
  }
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    this.RegisterForm.markAllAsTouched();
    this.spinner.show();
    if (!this.isLoginMode && this.RegisterForm.valid) {
      this.usersService.signUp(this.RegisterForm).subscribe({
        next: (v) => {
          this.toast.success({
            detail: 'Success',
            summary:
              'Register successfully! Please login again with your credentials',
            duration: 5000,
          });
        },
        error: (e) => {
          this.toast.error({
            detail: 'Failed',
            summary: e.error.message,
            duration: 5000,
          });
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        },
      });
    } else if (this.isLoginMode && this.isLoginValid()) {
      this.usersService.signIn(this.RegisterForm).subscribe({
        next: (v: any) => {
          this.toast.success({
            detail: 'Success',
            summary: 'Login successfully',
            duration: 5000,
          });
          localStorage.setItem('accessToken', v.token.accessToken.token);
          this.router.navigateByUrl('/welcome');
        },
        error: (e) => {
          this.toast.error({
            detail: 'Failed',
            summary: e.error.message,
            duration: 5000,
          });
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    }
  }
  isLoginValid(): boolean {
    const isEmailValid = this.RegisterForm.get('email');
    const isPasswordValid = this.RegisterForm.get('password');
    return (isEmailValid?.valid ?? false) && (isPasswordValid?.valid ?? false);
  }
  get Email(): FormControl {
    return this.RegisterForm.get('email') as FormControl;
  }
  get Password(): FormControl {
    return this.RegisterForm.get('password') as FormControl;
  }
  get UserName(): FormControl {
    return this.RegisterForm.get('username') as FormControl;
  }
}
