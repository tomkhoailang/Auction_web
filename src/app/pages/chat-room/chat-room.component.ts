import { Component, OnInit } from '@angular/core';
import { ChatRoomService } from '../../services/chat-room.service';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrl: './chat-room.component.css',
})
export class ChatRoomComponent implements OnInit {
  chatRoomInfo: any[] = [];
  constructor(
    private chatRoomService: ChatRoomService,
    private chatService: ChatService,
    private toast: NgToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chatRoomService.getUserChatRooms().subscribe({
      next: (value: any) => {
        this.chatRoomInfo = value.response;
        console.log(this.chatRoomInfo[0]);
      },
      error(err) {},
      complete() {},
    });
  }

  redirectToChatRoom(chatRoomId: string) {
    const selectedChatRoom = this.chatRoomInfo.find(
      (cr) => cr.chatRoomId === chatRoomId
    );
    this.chatService.currentChatRoom = selectedChatRoom;
    if (new Date(selectedChatRoom.startDate) > new Date()) {
      this.toast.warning({
        detail: 'Warning',
        summary: 'Please wait until the bidding room is started',
        duration: 5000,
      });
    } else if (new Date(selectedChatRoom.endDate) < new Date()) {
      this.toast.warning({
        detail: 'Warning',
        summary:
          'The bidding room is completed. You can see your bids at your profile',
        duration: 5000,
      });
    } else {
      sessionStorage.setItem('chatRoomId', chatRoomId);
      this.router.navigate(['/chat']);
    }
  }
  formatDate(dateString: string): any {
    const date = new Date(dateString);
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    if (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return 'Today ' + date.toLocaleTimeString('en-US', options);
    } else {
      return date.toLocaleTimeString('en-Us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  }
}
