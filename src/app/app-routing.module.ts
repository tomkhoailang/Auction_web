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
import { ManageProductUserComponent } from './pages/product/manage-product-user/manage-product-user.component';
import { CreateChatRoomComponent } from './pages/manage-chatroom-admin/create-chat-room/create-chat-room.component';
import { ChatroomsComponent } from './pages/manage-chatroom-admin/chatrooms/chatrooms.component';
import { ChatRoomDetailsComponent } from './pages/manage-chatroom-admin/chat-room-details/chat-room-details.component';
import { ChatRoomEditComponent } from './pages/manage-chatroom-admin/chat-room-edit/chat-room-edit.component';
import { ProductDetailsComponent } from './pages/product/product-details/product-details.component';
import { ProductsComponent } from './pages/product/products/products.component';
import { UserBiddingsComponent } from './pages/product/user-biddings/user-biddings.component';


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
  {
    path: 'manage-chatroom-admin/chat-room-details/:encodedId',
    component: ChatRoomDetailsComponent
  },
  {
    path: 'manage-chatroom-admin/chat-room-edit/:encodedId',
    component: ChatRoomEditComponent
  },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'login', component: LoginComponent },
  { path: 'product/manage-user', component: ManageProductUserComponent, canActivate: [PermissionsService]},
  { path: 'product/products', component: ProductsComponent, canActivate: [PermissionsService] },
  { path: 'product/product-details', component: ProductDetailsComponent, canActivate: [PermissionsService] },
  { path: 'product/user-biddings', component: UserBiddingsComponent, canActivate: [PermissionsService] },
  { path: 'product/product-details/:ProductId', component: ProductDetailsComponent, canActivate: [PermissionsService] },
  { path: 'manage-chatroom-admin/create-chat-room', component: CreateChatRoomComponent, canActivate: [PermissionsService]},
  { path: 'manage-chatroom-admin/chatrooms', component: ChatroomsComponent, canActivate: [PermissionsService]},
  { path: 'manage-chatroom-admin/chat-room-details', component: ChatRoomDetailsComponent, canActivate: [PermissionsService]},
  { path: 'manage-chatroom-admin/chat-room-details/:ChatRoomId', component: ChatRoomDetailsComponent, canActivate: [PermissionsService] },
  { path: 'manage-chatroom-admin/chat-room-edit', component: ChatRoomEditComponent, canActivate: [PermissionsService]},
  { path: 'manage-chatroom-admin/chat-room-edit/:ChatRoomId', component: ChatRoomEditComponent, canActivate: [PermissionsService] }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [PermissionsService],
})
export class AppRoutingModule {}
