import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { sign } from 'crypto';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {}
  signUp(formData: FormGroup) {
    const signUpCredentials = {
      ...formData.value,
      Role: 'Admin',
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
  test() {
    let url = 'http://localhost:5274/api/admin';
    return this.http.get(url);
  }
}
