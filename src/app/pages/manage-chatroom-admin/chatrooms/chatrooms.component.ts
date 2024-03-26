import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { ChatRoomService } from '../../../services/chat-room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatrooms',
  templateUrl: './chatrooms.component.html',
  styleUrl: './chatrooms.component.css'
})
export class ChatroomsComponent {
  userId: any;
  ChatRoomList: any[] = [];
  constructor (

    private productService: ProductService,
    private http: HttpClient,
    private router: Router,
    private chatRoomService: ChatRoomService
  ){}

  ngOnInit(): void {
    console.log('aaa')
    if (typeof document !== 'undefined') {
      this.userId = sessionStorage?.getItem('id');
      console.log(this.userId)
      this.chatRoomService.getAllChatRooms().subscribe((data: any) => {
        console.log(data)
        console.log('bbbb')
        this.ChatRoomList = data.response;
      })

    }
  }

  toDetailsChatRoom(ChatRoomId: number): void {
    this.router.navigateByUrl(`/manage-chatroom-admin/chat-room-details/${ChatRoomId}`)
  }

  toDetailsProduct(ProductId: number): void {
    this.router.navigateByUrl(`/product/product-details/${ProductId}`)
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
