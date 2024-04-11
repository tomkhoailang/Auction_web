import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { AppComponent } from './app.component';
import { ChatComponent } from './pages/chat/chat.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { customInterceptor } from './interceptors/custom.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { errorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { CreateComponent } from './pages/product/create/create.component';
import { ChatRoomComponent } from './pages/chat-room/chat-room.component';
import { VerifyOtpComponent } from './pages/verify-otp/verify-otp.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ManageProductUserComponent } from './pages/product/manage-product-user/manage-product-user.component';
import { EditComponent } from './pages/product/edit/edit.component';
import { CreateChatRoomComponent } from './pages/manage-chatroom-admin/create-chat-room/create-chat-room.component';
import { ChatroomsComponent } from './pages/manage-chatroom-admin/chatrooms/chatrooms.component';
import { ChatRoomDetailsComponent } from './pages/manage-chatroom-admin/chat-room-details/chat-room-details.component';
import { ChatRoomEditComponent } from './pages/manage-chatroom-admin/chat-room-edit/chat-room-edit.component';
import { ProductDetailsComponent } from './pages/product/product-details/product-details.component';
import { ProductsComponent } from './pages/product/products/products.component';
import { UserBiddingsComponent } from './pages/product/user-biddings/user-biddings.component';


@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    WelcomeComponent,
    JoinRoomComponent,
    LoginComponent,
    NavbarComponent,
    CreateComponent,
    ChatRoomComponent,
    VerifyOtpComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    ResetPasswordComponent,
    ManageProductUserComponent,
    EditComponent,
    CreateChatRoomComponent,
    ChatroomsComponent,
    ChatRoomDetailsComponent,
    ChatRoomEditComponent,
    ProductDetailsComponent,
    UserBiddingsComponent,
    ProductsComponent,
    UserBiddingsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgToastModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    RouterModule.forRoot([]) // Add RouterModule.forRoot() here
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([customInterceptor, errorHandlerInterceptor])
    ),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
