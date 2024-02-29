import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './pages/chat/chat.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { JoinRoomComponent } from './pages/join-room/join-room.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
LoginComponent;
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
import { customInterceptor } from './services/custom.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { errorHandlerInterceptor } from './services/error-handler.interceptor';
@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    WelcomeComponent,
    JoinRoomComponent,
    LoginComponent,
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
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([customInterceptor, errorHandlerInterceptor])
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
