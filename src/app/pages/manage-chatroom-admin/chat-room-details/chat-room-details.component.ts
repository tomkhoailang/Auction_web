import { ChangeDetectorRef, Component } from '@angular/core';
import { ChatRoomComponent } from '../../chat-room/chat-room.component';
import { ChatRoomService } from '../../../services/chat-room.service';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat-room-details',
  templateUrl: './chat-room-details.component.html',
  styleUrl: './chat-room-details.component.css'
})
export class ChatRoomDetailsComponent {
  ProductList: any[] = [];
  selectedProduct: any;
  selectedImage: any;
  ChatRoom: any;
  ChatRoomId: any;
  StatusList: any[] = [];
  userId: any;
  files: any = [];
  uploadedImages: string[] = [];
  constructor (
    private chatRoomService: ChatRoomService,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private http: HttpClient
  ){}
  ngOnInit(): void{
    this.ChatRoomId = this.route.snapshot.paramMap.get('ChatRoomId');
    if(this.ChatRoomId){
      if(typeof document != 'undefined'){
      
        this.chatRoomService.getChatRoom(this.ChatRoomId).subscribe((data: any) =>{
          console.log(data);
          this.ChatRoom = data.response;
        })
  
        this.productService.getProductListFromChat(this.ChatRoomId).subscribe((data: any) =>{
          console.log(data);
          this.ProductList = data.response;
          this.selectedProduct = this.ProductList[0];
          this.selectedImage = 'productImages/' + this.selectedProduct.images[0].image;
          console.log(this.ProductList)
        })
      }
    }
    
  }

  DeleteThisChatRoom() {
    var answer = window.confirm("Delete this Chat Room?");
    if (answer) {
      this.chatRoomService.deleteChatRoom(this.ChatRoom.chatRoomId).subscribe({  
          next: () => { },
          error: () => { },
          complete: () => { var answer = window.alert("Success");   
  
          this.router.navigateByUrl('/manage-chatroom-admin/chatrooms');
        }
        
      })
      
    }
    else {
    }
  }

  changeImage(image: any) {
    this.selectedImage = 'productImages/' + image;
  }
  setSelectedProduct(product: any){
    this.selectedProduct = product;
    this.selectedImage = 'productImages/' + product.images[0].image;
    console.log(this.selectedImage)
  }

  EditThisChatRoom(ChatRoomId: number) {
    this.router.navigateByUrl(`/manage-chatroom-admin/chat-room-edit/${ChatRoomId}`)
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
