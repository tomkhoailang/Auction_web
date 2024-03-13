import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { sign } from 'crypto';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  getIsLoggedIn() {
    return this.loggedIn$;
  }
  setIsLoggedIn(value: boolean) {
    this.loggedIn$.next(value);
  }

  constructor(private http: HttpClient) {}
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
    return this.http.post(url, signInCredentials);
  }
  signOut(): void {
    localStorage.clear();
    this.setIsLoggedIn(false);
  }
  getUserInfo() {
    let url = 'http://localhost:5274/api/user';
    return this.http.get(url);
  }
}
