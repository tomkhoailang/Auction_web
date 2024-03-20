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
import { Router } from 'express';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  ResetPasswordForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private toast: NgToastService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.ResetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  onSubmit() {
    this.spinner.show();
    this.userService.resetPassword(this.ResetPasswordForm).subscribe({
      next: (v: any) => {
        this.toast.success({
          detail: 'Success',
          summary: 'Send email successfully. Please check your email',
          duration: 5000,
        });
      },
      error: (e: any) => {
        if (e.message === 'No user found') {
          this.toast.error({
            detail: 'Failed',
            summary: 'No user found with that email',
            duration: 5000,
          });
          this.spinner.hide();
        }
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }
  get Email(): FormControl {
    return this.ResetPasswordForm.get('email') as FormControl;
  }
}
