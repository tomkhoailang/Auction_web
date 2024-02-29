import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  input,
  viewChild,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, AfterViewChecked {
  constructor(private chatService: ChatService, private router: Router) {}
  inputMessage = '';
  messages: any[] = [];
  loggedInUserName = sessionStorage.getItem('user');
  room = sessionStorage.getItem('room');
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;
  ngOnInit(): void {
    this.chatService.messages$.subscribe((res) => {
      this.messages = res;
      console.log(this.messages);
    });
  }
  getChatService(): ChatService {
    return this.chatService;
  }
  ngAfterViewChecked(): void {
    this.scrollContainer.nativeElement.scrollTop =
      this.scrollContainer.nativeElement.scrollHeight;
  }
  sendMessage() {
    this.chatService
      .sendMessage(this.inputMessage)
      .then(() => (this.inputMessage = ''))
      .catch((err) => console.log(err));
  }
  leaveChat() {
    this.chatService
      .leaveChat()
      .then(() => {
        this.router.navigate(['/join-room']);
        setTimeout(() => {
          location.reload();
        }, 0);
      })
      .catch((err) => console.log(err));
  }
}
