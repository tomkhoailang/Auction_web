import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { sign } from 'crypto';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { AuthResponse } from '../utils/authResponse';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private role$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private isRefreshSucceed$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  getIsLoggedIn() {
    return this.loggedIn$;
  }
  setIsLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
  }
  getIsRefreshSucceed() {
    return this.isRefreshSucceed$;
  }
  setIsRefreshSucceed(value: boolean) {
    this.isRefreshSucceed$.next(value);
  }
  setRole(value: string) {
    this.role$.next(value);
  }
  getRole() {
    return this.role$;
  }

  constructor(private http: HttpClient, private cookieService: CookieService) {}
  signUp(formData: FormGroup) {
    const signUpCredentials = {
      ...formData.value,
      role: 'User',
    };
    let url = 'http://localhost:5274/api/authentication/sign-up';
    return this.http.post(url, signUpCredentials);
  }
  signIn(formData: FormGroup) {
    const email = formData.get('email')?.value;
    const password = formData.get('password')?.value;

    const signInCredentials = {
      email: email,
      password: password,
    };
    let url = 'http://localhost:5274/api/authentication/sign-in';
    return this.http.post(url, signInCredentials, {
      observe: 'response',
      withCredentials: true,
    });
  }
  loginOtp(otp: string) {
    let url = `http://localhost:5274/api/authentication/login-2FA?code=${otp}`;
    return this.http.post(url, { code: otp }, { withCredentials: true });
  }
  resetPassword(resetForm: FormGroup) {
    var email = resetForm.get('email')?.value;
    console.log(email);
    let url = `http://localhost:5274/api/authentication/forgot-password?Email=${email}`;
    return this.http.post(url, {});
  }
  refreshToken(authResponse: AuthResponse) {
    let url = `http://localhost:5274/api/authentication/refresh-token`;
    return this.http.post(url, {
      AccessToken: authResponse.AccessToken,
      RefreshToken: authResponse.RefreshToken,
    });
  }
  signOut(): void {
    if (typeof window !== 'undefined' && window.document) {
      localStorage.clear();
      sessionStorage.clear();
    }
    this.setIsLoggedIn(false);
  }
  changeTwoFactor() {
    let url = 'http://localhost:5274/api/authentication/enable-2FA';
    return this.http.post(url, {});
  }
  changePassword(changePasswordModel: any) {
    let url = 'http://localhost:5274/api/authentication/change-password';
    return this.http.post(url, changePasswordModel);
  }
  verifyResetPassword(changePasswordModel: any) {
    let url = `http://localhost:5274/api/authentication/reset-password?token=${changePasswordModel.token}&email=${changePasswordModel.email}`;
    return this.http.post(url, { NewPassword: changePasswordModel.password });
  }
  getUserInfo() {
    let url = 'http://localhost:5274/api/user';
    return this.http.get(url);
  }
}
