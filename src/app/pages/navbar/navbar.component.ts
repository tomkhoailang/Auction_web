import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  role: string = '';
  constructor(private userService: UsersService, private router: Router) {}
  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: (v: any) => {
        this.role = v.response.role;
        sessionStorage.removeItem('user');
        sessionStorage.setItem('user', v.response.userName);
        sessionStorage.removeItem('id');
        sessionStorage.setItem('id', v.response.id);

        this.userService.setIsLoggedIn(true);
      },
      error: (v) => {
        if (v.message === 'Unauthorized') {
          if (typeof document !== 'undefined') {
            localStorage.removeItem('accessToken');
          }
          this.router.navigateByUrl('/login');
        }
      },
      complete: () => {},
    });
  }

  getIsLoggedIn(): BehaviorSubject<boolean> {
    return this.userService.getIsLoggedIn();
  }
  signOut(): void {
    this.userService.signOut();
    this.router.navigateByUrl('/login');
  }
  redirectToCreateProduct(): void {
    this.router.navigateByUrl('/product/create');
  }
  redirectToHomepage(): void {
    this.router.navigateByUrl('/welcome');
  }
  redirectToChatRoomPage(): void {
    this.router.navigateByUrl('/chat-room');
  }
}
