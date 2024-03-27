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
  currentTime: any;
  selectedProduct: any;
  selectedImage: any;
  ChatRoom: any;
  ChatRoomId: any;
  StatusList: any[] = [];
  imgObject: any[] = [];
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
        this.currentTime = new Date();
        this.chatRoomService.getChatRoom(this.ChatRoomId).subscribe((data: any) =>{
          console.log(data);
          this.ChatRoom = data.response;
        })
  
        this.productService.getProductListFromChat(this.ChatRoomId).subscribe((data: any) =>{
          console.log(data);
          this.ProductList = data.response;
          this.ProductList.forEach(element => {

            element.images.forEach((image: any) => {
              this.loadImage(image.image, element.productId)
            });
          });
          console.log("test", this.imgObject)
          this.selectedProduct = this.ProductList[0];
          this.selectedImage = 'productImages/' + this.selectedProduct.images[0].image;
          console.log(this.ProductList)
        })
      }
    }
    
  }

  loadImage(imgName: string, productId: number) {
    this.productService.getImage(imgName).subscribe(
      (data: Blob) => {
        // debugger
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result;
          const existingProductIndex = this.imgObject.findIndex(obj => obj.productId === productId);
          if (existingProductIndex !== -1) {
            // Product already exists, append image data
            this.imgObject[existingProductIndex].images.push(imageData);
          } else {
            // Product doesn't exist, create new object
            this.imgObject.push({ productId: productId, images: [imageData] });
          }
        };
        reader.readAsDataURL(data);
      },
      (error) => {
        console.error('Error loading image:', error);
      }
    );

  }

  getImage(productId: number) {
    const product = this.imgObject.find(element => element.productId === productId);
    return product ? product.images : [];
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
    this.selectedImage = image;
  }
  setSelectedProduct(product: any){
    this.selectedProduct = product;
    this.selectedImage = this.getImage(product.productId)[0];
    console.log(this.selectedImage)
  }

  EditThisChatRoom(ChatRoomId: number) {
    this.router.navigateByUrl(`/manage-chatroom-admin/chat-room-edit/${ChatRoomId}`)
  }

  isBidding(chatRoom: any){
    let startChatRoom = new Date(chatRoom.startDate);
    if(startChatRoom>this.currentTime){
      return true;
    }
    return false;
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
