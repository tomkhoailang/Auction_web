import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { NgToastService } from 'ng-angular-popup';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css',
})
export class VerifyOtpComponent {
  otp: string = '';
  constructor(
    private userService: UsersService,
    private toast: NgToastService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  loginOtp() {
    this.spinner.show();
    this.userService.loginOtp(this.otp).subscribe({
      next: (v: any) => {
        this.toast.success({
          detail: 'Success',
          summary: 'Login successfully',
          duration: 5000,
        });
        localStorage.setItem('accessToken', v.response.accessToken.token);
        this.userService.setIsLoggedIn(true);
        this.router.navigateByUrl('/welcome');
      },
      error: (e: Error) => {
        this.toast.error({
          detail: 'Failed',
          summary: e.message,
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
