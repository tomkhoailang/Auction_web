import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { ChatRoomService } from '../../../services/chat-room.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat-room-edit',
  templateUrl: './chat-room-edit.component.html',
  styleUrl: './chat-room-edit.component.css'
})

export class ChatRoomEditComponent implements OnInit {
  ProductWaitingList: any[] = [];
  ProductList: any[] = [];
  StatusList: any[] = [];
  areSubmit: any;
  ChatRoomId: any;
  userId: any;
  CustomDuration: any;
  productIdEdit: any;
  CreateChatRoomForm!: FormGroup;
  checkedStates: boolean[] = [];
  uploadedImages: string[] = [];
  imgObject: any[] = [];
  isInputDisabled: boolean = true;
  isCustomDuration: boolean = true;
  isErrorDuration: boolean = false;
  startDate: any;
  productToAddRoom: any[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private http: HttpClient,
    private chatRoomService: ChatRoomService
  ) { }
  ngOnInit(): void {
    this.ChatRoomId = this.route.snapshot.paramMap.get('ChatRoomId');
    this.CreateChatRoomForm = this.fb.group({
      StartDate: ['', Validators.required],
      CustomDuration: ['', Validators.required]
    });
    if (typeof document !== 'undefined') {
      this.userId = sessionStorage?.getItem('id');
      console.log(this.userId)
      this.areSubmit = true;

      this.ResetForm();
      
    }

  }

  ResetForm(){
    this.ProductList = [];
    this.ProductWaitingList = [];
    this.productToAddRoom = [];
    this.checkedStates = [];
    
    
    this.productService.getProductListFromChat(this.ChatRoomId).subscribe((data: any) => {

      this.productToAddRoom = data.response;

      this.productToAddRoom.forEach(element => {

        element.images.forEach((image: any) => {
          this.loadImage(image.image, element.productId)
        });
      });
      this.productToAddRoom.forEach((element) => {
        this.checkedStates.push(true);
        this.ProductList.push(element)
      });

    })
    this.chatRoomService.getChatRoom(this.ChatRoomId).subscribe((data: any) => {

      console.log('startDate', data.response.startDate);
      this.startDate = new Date(data.response.startDate);
      var i = data.response.chatRoomProducts[0];
      this.CustomDuration = data.response.customDuration;

      var startDate = new Date(this.startDate.getTime());
    
      const offset = this.startDate.getTimezoneOffset() / 60; // Get the time zone offset in hours
      this.startDate.setHours(this.startDate.getHours());
      startDate.setHours(startDate.getHours() - offset);
      const formattedStartDate = startDate.toISOString().slice(0, 16);
      console.log('startdate after',this.startDate);

      this.CreateChatRoomForm.patchValue({
        StartDate: formattedStartDate.toString(),
        CustomDuration: this.CustomDuration  
      });
      this.setEndDate();
    })
    this.productService.getProductsWithStatus(1).subscribe((data: any) => {
      this.ProductWaitingList = data.response;
      this.ProductWaitingList.forEach(element => {

        element.images.forEach((image: any) => {
          this.loadImage(image.image, element.productId)
        });
      });
      console.log("test", this.imgObject)
      this.ProductWaitingList.forEach((element) => {
        this.checkedStates.push(false);
        this.ProductList.push(element);
      });
    })
    
  }

  onInput(event: Event) {
    // This method will be called whenever there is any input in the input field
    console.log('Input value:', (event.target as HTMLInputElement).value);
    var dur = (event.target as HTMLInputElement).value;
    this.CustomDuration = parseInt(dur, 10);
    this.setEndDate();
  }

  getDuration(data: any){
    var date1 = new Date(data.biddingEndTime)
    var date2 = new Date(data.biddingStartTime)
    console.log(date1, date2)
    var num = date1.getTime() - date2.getTime();
    var nums = Math.floor(num / (1000 * 60));
    return nums
  }
  onCancel(): void {
    this.ResetForm();
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

  getCurrentDateTime(): string {
    const now = new Date();
    // Format the current date and time to match the format required by datetime-local input
    const formattedDateTime = `${now.getFullYear()}-${this.padZero(now.getMonth() + 1)}-${this.padZero(now.getDate())}T${this.padZero(now.getHours())}:${this.padZero(now.getMinutes())}`;
    return formattedDateTime;
  }

  padZero(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }

  TestCheckBox(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    if (target && target instanceof HTMLInputElement) {
      if (target.checked) {
        this.productToAddRoom.push(this.ProductList.at(index));
        if (this.startDate) {
          this.setEndDate();
        }
        this.checkedStates[index] = target.checked;
      }
      else {
        for (let i = 0; i < this.productToAddRoom.length; i++) {
          if (this.productToAddRoom[i].productId == target.value) {
            this.productToAddRoom.splice(i, 1);
            this.setEndDate();
            break;
          }
        }
        this.checkedStates[index] = target.checked;
      }
    }
  }

  handleInput(event: any) {
    const inputValue: string = event.target.value;
    this.startDate = new Date(inputValue);
    this.setEndDate();
  }

  setEndDate() {
    if(this.startDate){
      let startDate = new Date(this.startDate.getTime());
      
      const endDateInput: HTMLInputElement | null = document.getElementById('endDate') as HTMLInputElement;
      if(isNaN(startDate.valueOf())){
        endDateInput.value = '';
      }
      else{
        console.log('duration',this.CustomDuration)
        console.log('start',startDate)
        startDate.setMinutes(startDate.getMinutes() + 5 + (this.CustomDuration + 5) * this.productToAddRoom.length);
        console.log('end',startDate)
        // Get the time zone offset in minutes
        const offsetMinutes = startDate.getTimezoneOffset();
    
        // Adjust for the time zone offset
        startDate.setMinutes(startDate.getMinutes() - offsetMinutes);
        console.log('after convert',startDate)
        const formattedEndDate = startDate.toISOString().slice(0, 16);
        console.log('after format',formattedEndDate)
        if (endDateInput) {
          endDateInput.value = formattedEndDate;
        }
      }

    }
    
  }

  setEnableCustom() {
    this.isCustomDuration = !this.isCustomDuration;
    this.cdr.detectChanges();
  }

  onSubmit(): void {
    if(this.CreateChatRoomForm.value?.CustomDuration < 10){
      this.isErrorDuration = true;
    }
    else{
      this.isErrorDuration = false;
      const payload = {
        startDate: this.startDate,
        duration: this.CreateChatRoomForm.value?.CustomDuration
      };
      console.log(payload);
      this.chatRoomService.editChatRoom(payload, this.ChatRoomId).subscribe({
        next: (response: any) => {
          const chatRoomId = response.response.chatRoomId;
          const products: any[] = [];
          this.productToAddRoom.forEach(element => {
            products.push(element.productId);
          });
          const data = {
            ChatRoomId: chatRoomId,
            ProductIds: products,
            Duration: payload.duration
          };
          this.chatRoomService.registerProductToChatRoom(data).subscribe({
            complete:() => {
                var answer = window.alert("Success"); this.onCancel(); window.location.reload() 
            }
          })
        },
        error:() => {
            
        },
      });

    }
  }


}
