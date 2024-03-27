import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { unescape } from 'querystring';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  role = '';
  constructor(private userService: UsersService, private router: Router) {}
  ngOnInit(): void {
    const excludedUrls = [
      '/forgot-password',
      '/login',
      '/reset-password',
      '/verify-otp',
    ];
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((nav: any) => {
        const matches = nav.url.match(/\/reset-password/);

        const resetPasswordValue = matches ? matches[0] : null;
        if (
          !excludedUrls.includes(nav.url) &&
          !excludedUrls.includes(resetPasswordValue)
        ) {
          this.userService.getUserInfo().subscribe({
            next: (v: any) => {
              this.userService.setRole(v.response.role);
              this.userService.getRole().subscribe((role) => {
                this.role = role;
              });
              console.log('test 2', v.response);
              sessionStorage.removeItem('user');
              sessionStorage.removeItem('id');
              sessionStorage.removeItem('2fa');
              sessionStorage.removeItem('email');

              sessionStorage.setItem('user', v.response.userName);
              sessionStorage.setItem('email', v.response.email);
              sessionStorage.setItem('2fa', v.response.twoFactorEnabled);
              sessionStorage.setItem('id', v.response.id);
              this.userService.setIsLoggedIn(true);
            },
            error: (v) => {},
            complete: () => {},
          });
        }
      });
  }

  getIsLoggedIn(): BehaviorSubject<boolean> {
    return this.userService.getIsLoggedIn();
  }
  getRole(): BehaviorSubject<string> {
    return this.userService.getRole();
  }
  signOut(): void {
    this.userService.signOut();
    this.router.navigateByUrl('/login');
  }
  redirectToCreateChatRoom(): void {
    console.log('create room');
    this.router.navigateByUrl('/manage-chatroom-admin/create-chat-room');
  }
  redirectToProducts(): void {
    console.log('product list');
    this.router.navigateByUrl('/product/products');
  }
  redirectToAllChatRoom(): void {
    console.log('all room');
    this.router.navigateByUrl('/manage-chatroom-admin/chatrooms');
  }
  redirectToUserProducts(): void {
    this.router.navigateByUrl('/product/manage-user');
  }
  redirectToHomepage(): void {
    this.router.navigateByUrl('/welcome');
  }
  redirectToChatRoomPage(): void {
    this.router.navigateByUrl('/chat-room');
  }
  redirectToProfilePage(): void {
    this.router.navigateByUrl('/profile');
  }
}
