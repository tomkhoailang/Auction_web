import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent implements OnInit {
  ResetPasswordForm!: FormGroup;
  token: string = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userService: UsersService,
    private toast: NgToastService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.ResetPasswordForm = this.fb.group({
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
      retypeNewPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
    });
    if (this.newPassword) {
      this.retypeNewPassword.setValidators(this.matchPasswordValidator());
    }
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const tToken = params.get('token');
      const tEmail = params.get('email');
      this.token = tToken != null ? tToken : '';
      this.email = tEmail != null ? tEmail : '';
    });
  }
  get newPassword(): FormControl {
    return this.ResetPasswordForm.get('newPassword') as FormControl;
  }
  get retypeNewPassword(): FormControl {
    return this.ResetPasswordForm.get('retypeNewPassword') as FormControl;
  }
  onSubmit(): void {
    this.spinner.show();
    this.userService
      .verifyResetPassword({
        email: this.email,
        token: this.token,
        password: this.newPassword.value,
      })
      .subscribe({
        next: () => {
          this.toast.success({
            detail: 'Success',
            summary: 'Reset password successfully',
            duration: 5000,
          });
          this.router.navigate(['/login']);
        },
        error: () => {
          this.toast.error({
            detail: 'Failed',
            summary:
              'This link is no longer valid. Please send email to reset your password again',
            duration: 5000,
          });
          this.router.navigate(['/login']);
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        },
      });
  }
  matchPasswordValidator() {
    return (control: AbstractControl) => {
      const newPassword = this.ResetPasswordForm.get('newPassword')?.value;
      const retypeNewPassword = control.value;

      if (newPassword !== retypeNewPassword) {
        return { passwordNotMatch: true };
      }
      return null;
    };
  }
}
