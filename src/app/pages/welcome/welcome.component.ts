import { Component, Inject, OnInit, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent implements OnInit {
  constructor(private userService: UsersService) {}
  ngOnInit(): void {
    this.userService.test().subscribe({
      next: (v) => console.log(v),
      error: (v) => console.log(v),
      complete: () => {},
    });
  }
}
