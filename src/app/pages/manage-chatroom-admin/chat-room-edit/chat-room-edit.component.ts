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
  productIdEdit: any;
  CreateChatRoomForm!: FormGroup;
  checkedStates: boolean[] = [];
  uploadedImages: string[] = [];
  imgObject: any[] = [];
  isInputDisabled: boolean = true;
  startDate: any;
  productToAddRoom: any[] = [];
  constructor(
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
      StartDate: ['', Validators.required]
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
    this.chatRoomService.getChatRoom(this.ChatRoomId).subscribe((data: any) => {

      this.startDate = new Date(data.response.startDate);
      const formattedStartDate = this.startDate.toISOString().slice(0, 16);
      const offset = this.startDate.getTimezoneOffset() / 60; // Get the time zone offset in hours
      this.startDate.setHours(this.startDate.getHours() + offset);
      console.log(formattedStartDate);

      this.CreateChatRoomForm.patchValue({
        StartDate: formattedStartDate.toString()
      });
      this.setEndDate();
    })
    
    this.productService.getProductListFromChat(this.ChatRoomId).subscribe((data: any) => {
      console.log(data)

      this.productToAddRoom = data.response;
      this.productToAddRoom.forEach(element => {

        element.images.forEach((image: any) => {
          this.loadImage(image.image, element.productId)
        });
      });
      console.log("test", this.imgObject)
      this.productToAddRoom.forEach((element) => {
        this.checkedStates.push(true);
        this.ProductList.push(element)
      });

    })

    this.productService.getProductsWithStatus(1).subscribe((data: any) => {
      console.log(data)

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
    
    this.chatRoomService.getChatRoom(this.ChatRoomId).subscribe((data: any) => {
      
      this.startDate = new Date(data.response.startDate);
      const startDate = new Date(this.startDate.getTime());
      const offset = startDate.getTimezoneOffset() / 60; // Get the time zone offset in hours
      startDate.setHours(startDate.getHours() - offset); // Adjust the hours by subtracting the offset
      const formattedStartDate = startDate.toISOString().slice(0, 16);
      console.log(formattedStartDate);

      this.CreateChatRoomForm.patchValue({
        StartDate: formattedStartDate.toString()
      });
      this.setEndDate();
    })
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
      console.log(startDate.valueOf())
      const endDateInput: HTMLInputElement | null = document.getElementById('endDate') as HTMLInputElement;
      if(isNaN(startDate.valueOf())){
        endDateInput.value = '';
      }
      else{
        startDate.setMinutes(startDate.getMinutes() + 5 + 35 * this.productToAddRoom.length);
  
        // Get the time zone offset in minutes
        const offsetMinutes = startDate.getTimezoneOffset();
    
        // Adjust for the time zone offset
        startDate.setMinutes(startDate.getMinutes() - offsetMinutes);
    
        const formattedEndDate = startDate.toISOString().slice(0, 16);
        
        if (endDateInput) {
          endDateInput.value = formattedEndDate;
        }
      }

    }
    
  }

  onSubmit(): void {
    const payload = {
      startDate: this.startDate
    };
    console.log(payload.startDate);
    this.chatRoomService.editChatRoom(payload, this.ChatRoomId).subscribe({
      next: (response: any) => {
        const chatRoomId = response.response.chatRoomId;
        const products: any[] = [];
        this.productToAddRoom.forEach(element => {
          products.push(element.productId);
        });
        const data = {
          ChatRoomId: chatRoomId,
          ProductIds: products
        };
        console.log(response)
        console.log(chatRoomId)
        this.chatRoomService.registerProductToChatRoom(data).subscribe({
          complete:() => {
              var answer = window.alert("Success"); this.onCancel(); window.location.reload() 
          }
        })
      }
    });
  }


}
