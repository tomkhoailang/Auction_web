import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomService {
  constructor(private http: HttpClient) {}
  getUserChatRooms() {
    let url = 'http://localhost:5274/api/Chatroom/user';
    return this.http.get(url);
  }
}
