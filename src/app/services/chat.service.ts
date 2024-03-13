import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  public connection: any = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5274/chathub')
    .configureLogging(signalR.LogLevel.Information)
    .build();
  public isConnected$ = new BehaviorSubject<boolean>(false);
  public messages$ = new BehaviorSubject<any>([]);
  public connectedUsers$ = new BehaviorSubject<any>([]);
  public biddingAmount$ = new BehaviorSubject<any>([]);
  public biddingMessages$ = new BehaviorSubject<any>([]);

  public messages: any[] = [];
  public biddingMessages: any[] = [];
  public users: string[] = [];
  public currentChatRoom: any;

  constructor(private httpClient: HttpClient) {
    this.start();
    this.connection.on(
      'ReceiveMessage:',
      (user: string, message: string, messageTime: string) => {
        this.messages = [...this.messages, { user, message, messageTime }];
        this.messages$.next(this.messages);
      }
    );
    this.connection.on('ConnectedUser', (users: any) => {
      this.connectedUsers$.next(users);
    });
    this.connection.on(
      'BiddingAmount:',
      (user: string, newBiddingAmount: number, messageTime: string) => {
        this.biddingAmount$.next(newBiddingAmount);
        let biddingMessage = `${user} has bid ${newBiddingAmount}`;

        this.biddingMessages = [
          ...this.biddingMessages,
          { user, newBiddingAmount, messageTime },
        ];
        this.biddingMessages$.next(this.biddingMessages);

        this.messages = [
          ...this.messages,
          { user: 'Bot', message: biddingMessage, messageTime },
        ];
        console.log(this.messages);
        this.messages$.next(this.messages);
      }
    );
  }

  public async start() {
    try {
      await this.connection.start();
      console.log('started');
      this.isConnected$.next(true);
    } catch (err) {
      console.log(err);
    }
  }
  public async joinRoom(user: string, room: string) {
    return this.connection.invoke('JoinRoom', { user, room });
  }
  public async sendMessage(message: string) {
    return this.connection.invoke('SendMessage', message);
  }
  createMessage(messageModel: any) {
    let data = {
      Content: messageModel.Content,
    };
    let url = `http://localhost:5274/api/chatroom/${messageModel.ChatRoomId}/messages`;
    return this.httpClient.post(url, data);
  }
  public async sendBidding(biddingAmount: number) {
    return this.connection.invoke('SendBidding', biddingAmount);
  }
  public async leaveChat() {
    return this.connection.stop();
  }
  public isAccessible(): boolean {
    console.log('1', this.currentChatRoom);
    if (
      new Date(this.currentChatRoom.startDate) > new Date() ||
      new Date(this.currentChatRoom.endDate) < new Date()
    ) {
      return false;
    }
    return true;
  }
}
