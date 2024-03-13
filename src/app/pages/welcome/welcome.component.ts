import { Component, Inject, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  isUser: boolean = false;
  constructor(private router: Router) {}
  ngOnInit(): void {}
}
