import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UsersService } from '../services/users.service';
import { AuthResponse } from '../utils/authResponse';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable()
export class PermissionsService {
  constructor(
    private userService: UsersService,
    private router: Router,
    private http: HttpClient
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    if (typeof document !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      const accessTokenExpires = localStorage.getItem('accessTokenExpires');
      const refreshToken = localStorage.getItem('refreshToken');
      const refreshTokenExpires = localStorage.getItem('refreshTokenExpires');
      const jwtHelper = new JwtHelperService();
      if (accessToken && !jwtHelper.isTokenExpired(accessToken)) {
        console.log(jwtHelper.decodeToken(accessToken));
        this.userService.setIsLoggedIn(true);
        return true;
      }
      if (refreshToken != null && refreshTokenExpires != null) {
        const authResponse: AuthResponse = {
          AccessToken: {
            Token: accessToken!,
            ExpirationTokenDate: new Date(accessTokenExpires!),
          },
          RefreshToken: {
            Token: refreshToken!,
            ExpirationTokenDate: new Date(refreshTokenExpires!),
          },
        };
        const isRefreshSuccess = await this.tryRefreshingTokens(authResponse);
        if (!isRefreshSuccess) {
          console.log('failed refresh');
        }
        this.userService.setIsLoggedIn(true);
        return isRefreshSuccess;
      }
    }
    return false;
  }
  private async tryRefreshingTokens(
    authResponse: AuthResponse
  ): Promise<boolean> {
    if (!authResponse.AccessToken.Token || !authResponse.RefreshToken.Token) {
      return false;
    }
    let isRefreshSuccess = false;
    try {
      const v: any = await lastValueFrom(
        this.userService.refreshToken(authResponse)
      );
      if (v.accessToken !== null) {
        localStorage.setItem('accessToken', v.accessToken.token);
        localStorage.setItem('refreshToken', v.refreshToken.token);
        this.userService.setIsRefreshSucceed(true);
        isRefreshSuccess = true;
      }
    } catch (error) {
      console.error('Error refreshing tokens:', error);
      this.userService.signOut();
    }

    return isRefreshSuccess;
  }
}
export function authGuard(authGuard: PermissionsService): CanActivateFn {
  return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    return await authGuard.canActivate(route, state);
  };
}
