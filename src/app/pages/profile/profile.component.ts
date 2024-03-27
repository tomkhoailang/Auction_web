import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { NgToastService } from 'ng-angular-popup';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  userName: string = '';
  email: string = '';
  twoFactor: boolean = false;
  ChangePasswordForm!: FormGroup;
  constructor(
    private userService: UsersService,
    private toast: NgToastService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  ngOnInit(): void {
    const storedUserName = sessionStorage.getItem('user');
    const storedEmail = sessionStorage.getItem('email');
    const stored2fa = sessionStorage.getItem('2fa');
    this.userName = storedUserName !== null ? storedUserName : '';
    this.email = storedEmail !== null ? storedEmail : '';
    var temp = stored2fa !== null ? stored2fa : '';
    this.twoFactor = temp === 'false' ? false : true;

    this.ChangePasswordForm = this.fb.group({
      currentPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      newPassword: [
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
  get currentPassword(): FormControl {
    return this.ChangePasswordForm.get('currentPassword') as FormControl;
  }
  get newPassword(): FormControl {
    return this.ChangePasswordForm.get('newPassword') as FormControl;
  }
  onSubmit(): void {
    this.spinner.show();
    this.userService
      .changePassword({
        OldPassword: this.currentPassword.value,
        NewPassword: this.newPassword.value,
      })
      .subscribe({
        next: (v) => {
          this.toast.success({
            detail: 'Success',
            summary: 'Change password successfully',
            duration: 5000,
          });
        },
        error: (e) => {
          if (e.message === 'Incorrect current password') {
            this.toast.error({
              detail: 'Failed',
              summary: 'The current password is incorrect',
              duration: 5000,
            });
          }

          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }
  signOut(): void {
    this.userService.signOut();
    this.router.navigateByUrl('/login');
  }
  onCheckboxChange(event: any) {
    this.userService.changeTwoFactor().subscribe({
      next: () => {
        this.twoFactor = !this.twoFactor;
        const stored2fa = sessionStorage.getItem('2fa');
        var temp = stored2fa !== null ? stored2fa : '';
        if (temp === 'true') {
          sessionStorage.removeItem('2fa');
          sessionStorage.setItem('2fa', 'false');
        } else {
          sessionStorage.removeItem('2fa');
          sessionStorage.setItem('2fa', 'true');
        }
      },
      error: () => {
        this.toast.error({
          detail: 'Something went wrong',
          type: 'error',
          summary: 'Failed',
        });
      },
      complete: () => {},
    });
  }
}
