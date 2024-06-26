import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { interval } from 'rxjs/internal/observable/interval';
import { ProductInChatService } from '../../services/product-in-chat.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, AfterViewChecked, AfterViewInit {
  inputMessage = '';
  messages: any[] = [];
  biddingMessages: any[] = [];
  loggedInUserName: any;
  room: any;
  userId: any;
  imgObject: any[] = [];
  minBidding: any = 0;
  sendBiddingForm!: FormGroup;
  selectedProduct: any;
  selectedImage: any;

  @ViewChild('testElement') private testElement!: ElementRef;
  @ViewChild('nextProductTime') private nextProductTime!: ElementRef;
  @ViewChild('currentBiddingPrice') private currentBiddingPrice!: ElementRef;
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;
  constructor(
    private chatService: ChatService,
    private productService: ProductService,
    private productInChatService: ProductInChatService,
    private fb: FormBuilder,
    private toast: NgToastService,
    private router: Router
  ) {}
  ngOnInit(): void {
    if (
      this.chatService.currentChatRoom === undefined ||
      !this.chatService.isAccessible()
    ) {
      this.router.navigate(['/chat-room']);
    }

    if (typeof document !== 'undefined') {
      this.loggedInUserName = sessionStorage?.getItem('user');
      this.room = sessionStorage?.getItem('chatRoomId');
      this.userId = sessionStorage?.getItem('id');

      this.productService
        .getProductListFromChat(this.room)
        .subscribe((data: any) => {
          this.productInChatService.productList = data.response;
          this.productInChatService.productList.forEach((element: any) => {
            element.images.forEach((image: any) => {
              this.loadImage(image.image, element.productId);
            });
          });
          console.log('test', this.imgObject);
          this.productInChatService.setCurrentBiddingProduct(this.room);
          let subscription = interval(1000).subscribe(() => {
            this.nextProductTime.nativeElement.innerHTML =
              this.productInChatService.getNextProductTime(this.room);
            if (
              this.productInChatService.getNextProductTime(this.room) ===
              'Next product time: 0h:0p:0s'
            ) {
              setTimeout(() => {
                this.productInChatService.setCurrentBiddingProduct(this.room);
                this.initCounting();
              }, 1000);
            } else if (
              this.productInChatService.getNextProductTime(this.room) ===
              'Next product time: No bidding left'
            ) {
              subscription.unsubscribe();
            }
          });
        });
    }

    this.chatService.isConnected$.subscribe((isConnected: boolean) => {
      if (isConnected) {
        this.chatService.joinRoom(this.loggedInUserName, this.room);
        this.chatService.messages$.subscribe((res) => {
          this.messages = res;
          console.log(this.messages);
        });
        this.chatService.biddingMessages$.subscribe((res) => {
          this.biddingMessages = res;
        });
      }
    });

    this.sendBiddingForm = this.fb.group({
      biddingValue: ['', [Validators.required]],
    });
  }
  transform(value: number): string {
    if (value) {
      const formattedValue = value.toLocaleString('vi-VN', {
        style: 'currency',
        currency: 'VND',
      });
      return formattedValue;
    }
    return '';
  }
  loadImage(imgName: string, productId: number) {
    this.productService.getImage(imgName).subscribe(
      (data: Blob) => {
        // debugger
        const reader = new FileReader();
        reader.onload = () => {
          const imageData = reader.result;
          const existingProductIndex = this.imgObject.findIndex(
            (obj) => obj.productId === productId
          );
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
    const product = this.imgObject.find(
      (element) => element.productId === productId
    );
    return product ? product.images : [];
  }

  changeImage(image: any) {
    this.selectedImage = image;
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

  setSelectedProduct(product: any) {
    this.selectedProduct = product;
    this.selectedImage = this.getImage(product.productId)[0];
    console.log(this.selectedProduct);
  }
  ngAfterViewInit(): void {
    this.productInChatService.isSet$.subscribe((isSet: boolean) => {
      if (isSet) {
        this.initCounting();
        if (this.testElement) {
          this.testElement.nativeElement.innerHTML =
            'Current bidding time: 00h:00m:00s';
        }
        if (this.currentBiddingPrice) {
          this.chatService.biddingAmount$.subscribe((biddingAmount: number) => {
            this.currentBiddingPrice.nativeElement.innerHTML =
              this.transform(biddingAmount);
            console.log('test', biddingAmount);
            if (!Array.isArray(biddingAmount)) {
              this.minBidding =
                biddingAmount +
                this.productInChatService.currentBiddingProduct.minimumStep;
            }
            this.sendBiddingForm
              .get('biddingValue')
              ?.setValidators([
                Validators.required,
                Validators.min(this.minBidding),
              ]);
            this.sendBiddingForm.get('biddingValue')?.updateValueAndValidity();
          });
          if (this.currentBiddingPrice.nativeElement.innerHTML === '') {
            if (this.productInChatService.currentBiddingProduct === undefined) {
              this.currentBiddingPrice.nativeElement.innerHTML = '0 VND';
            } else {
              this.currentBiddingPrice.nativeElement.innerHTML = this.transform(
                this.productInChatService.getCurrentBiddingPrice()
              );
            }
          }
        }
      }
    });
  }
  initCounting() {
    this.minBidding = this.productInChatService.getMinBiddingPrice();
    let subscription2 = interval(1000).subscribe(() => {
      this.testElement.nativeElement.innerHTML =
        'Current bidding time ' +
        this.productInChatService.getProductTime(
          this.productInChatService.currentChatRoomProduct.biddingEndTime
        );
      if (
        this.testElement.nativeElement.innerHTML ===
        'Current bidding time 0h:0p:0s'
      ) {
        if (
          this.biddingMessages.length === 0 &&
          this.productInChatService.currentBiddingProduct.biddings.length > 0
        ) {
          let biddingList =
            this.productInChatService.currentBiddingProduct.biddings;
          const maxValue = Math.max(
            ...biddingList.map((c: any) => c.biddingAmount)
          );
          var userId = biddingList.find((a: any) => {
            return a.biddingAmount === maxValue;
          }).biddingUserId;
          if (userId === this.userId) {
            this.toast.success({
              detail: 'Winning',
              duration: 3000,
              summary: 'You are the winner of this bidding ',
            });
          }
        } else {
          if (this.biddingMessages.length > 0) {
            var maxBidding = Math.max(
              ...this.biddingMessages.map((m) => m.newBiddingAmount)
            );
            console.log(maxBidding);
            console.log(
              this.biddingMessages.find((m: any) => {
                m.newBiddingAmount === maxBidding;
              })
            );
            var userName = this.biddingMessages.find((m: any) => {
              return m.newBiddingAmount === maxBidding;
            }).user;
            if (userName === this.loggedInUserName) {
              this.toast.success({
                detail: 'Winning',
                duration: 3000,
                summary: 'You are the winner of this bidding ',
              });
            }
          }
        }
        this.testElement.nativeElement.innerHTML =
          'Current bidding time: 00h:00m:00s';
        if (
          this.productInChatService.getNextProductTime(this.room) ==
          'Next product time: No bidding left'
        ) {
          this.testElement.nativeElement.innerHTML = 'This bidding is done';
          this.productInChatService.currentBiddingProduct = undefined;
          subscription2.unsubscribe();
        }
      }
    });
  }
  get BiddingValue() {
    return this.sendBiddingForm.get('biddingValue') as FormControl;
  }
  sendBidding() {
    const biddingValue = this.sendBiddingForm.get('biddingValue')?.value;
    this.productInChatService.createBidding(biddingValue).subscribe({
      next: () => {
        this.toast.success({
          detail: 'Bidding successfully',
          duration: 3000,
          summary: 'Success',
        });
      },
      error: () => {},
      complete: () => {},
    });
    this.chatService.sendBidding(biddingValue);
  }
  getProductInChatService(): ProductInChatService {
    return this.productInChatService;
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
    this.chatService
      .createMessage({
        Content: this.inputMessage,
        SenderId: this.loggedInUserName,
        ChatRoomId: Number.parseInt(this.room),
      })
      .subscribe({
        next: () => {},
        error: () => {},
        complete: () => {},
      });
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
