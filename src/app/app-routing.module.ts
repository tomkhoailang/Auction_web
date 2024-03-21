import { NgModule, createComponent } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ChatComponent } from './pages/chat/chat.component';
import { LoginComponent } from './pages/login/login.component';
import { CreateComponent } from './pages/product/create/create.component';
import { ChatRoomComponent } from './pages/chat-room/chat-room.component';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PermissionsService } from './guards/auth-guard.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'join-room', component: JoinRoomComponent },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [PermissionsService],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [PermissionsService],
  },
  { path: 'chat', component: ChatComponent, canActivate: [PermissionsService] },
  { path: 'reset-password', component: ResetPasswordComponent },

  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'verify-otp',
    component: VerifyOtpComponent,
  },
  {
    path: 'product/create',
    component: CreateComponent,
    canActivate: [PermissionsService],
  },
  {
    path: 'chat-room',
    component: ChatRoomComponent,
    canActivate: [PermissionsService],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [PermissionsService],
})
export class AppRoutingModule {}
