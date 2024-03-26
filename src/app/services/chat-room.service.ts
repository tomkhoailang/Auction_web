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
  createChatRoom(startDate: any) {
    console.log(startDate.startDate);
    let url = 'http://localhost:5274/api/ChatRoom';
    return this.http.post(url, startDate);
  }
  joinChatRoom(chatRoomId: number) {
    let url = `http://localhost:5274/api/ChatRoom/${chatRoomId}/join`;
    return this.http.post(url, chatRoomId);
  }
  registerProductToChatRoom(data: any) {
    let url = `http://localhost:5274/api/ChatRoom/${data.ChatRoomId}/products`;
    return this.http.post(url, data);
  }
  getAllChatRooms() {
    let url = 'http://localhost:5274/api/Chatroom';
    return this.http.get(url);
  }
  getChatRoom(chatRoomId: number) {
    let url = `http://localhost:5274/api/Chatroom/${chatRoomId}`;
    return this.http.get(url);
  }
  deleteChatRoom(chatRoomId: number) {
    let url = `http://localhost:5274/api/Chatroom/${chatRoomId}`;
    return this.http.delete(url);
  }
  editChatRoom(startDate: any, chatRoomId: number) {
    let url = `http://localhost:5274/api/Chatroom/${chatRoomId}`;
    return this.http.patch(url, startDate);
  }
}
