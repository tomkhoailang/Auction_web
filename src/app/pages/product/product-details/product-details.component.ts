import { Component } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChatRoomService } from '../../../services/chat-room.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})

export class ProductDetailsComponent {
  userId: any;
  ChatRoomList: any[] = [];
  constructor (
    private productService: ProductService,
    private http: HttpClient,
    private router: Router,
    private chatRoomService: ChatRoomService
  ){}

  ngOnInit(): void {
    if (typeof document !== 'undefined') {
      this.userId = sessionStorage?.getItem('id');
      console.log(this.userId)
      this.chatRoomService.getAllChatRooms().subscribe((data: any) => {
        console.log(data)
        this.ChatRoomList = data.response;
      })

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
