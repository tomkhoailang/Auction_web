import { Component, ViewChild } from '@angular/core';
import { ChatRoomService } from '../../../services/chat-room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-user-biddings',
  templateUrl: './user-biddings.component.html',
  styleUrl: './user-biddings.component.css'
})
export class UserBiddingsComponent {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  sortBy: number = -1; // Initial value for sortBy
  orderBy: number = 0; // Initial value for orderBy

  sortList: string[] = ['Name', 'Initial Price', 'Minimum Step', 'Start Date'];
  orderList: string[] = ['A - Z', 'Z - A'];
  biddingList: any[] = [];
  ProductList: any[] = [];
  ProductSave: any[] = [];
  pageSlice: any[] = [];
  selectedProduct: any;
  ChatRoomUsers: any[] = [];
  ChatRoomId: any;
  selectedImage: any;
  currentTime: any;
  imgObject: any[] = [];
  userId: any;
  files: any = [];
  uploadedImages: string[] = [];
  CreateProductForm!: FormGroup;
  constructor(
    private chatRoomService: ChatRoomService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private toast: NgToastService,
    private productService: ProductService,
    private http: HttpClient
  ) { }
  ngOnInit(): void {
    this.userId = sessionStorage?.getItem('id');
    this.CreateProductForm = this.fb.group({
      Name: ['', []],
      MinimumPrice: ['', []],
      MaximumPrice: ['', []],
      MinimumStep: ['', []],
      MaximumStep: ['', []],
      StartDate: ['', []],
      EndDate: ['', []],
    });
    if (typeof document != 'undefined') {
      this.currentTime = new Date(Date.now());
      this.chatRoomService.getUserChatRooms().subscribe((data: any) =>
        this.ChatRoomUsers = data.response
      );
      this.productService.getBiddingsProducts().subscribe((data: any) => {
        console.log('this is data', data);
        this.ProductList = data.response;
        this.ProductSave = data.response;
        this.ProductList.forEach(element => {

          element.images.forEach((image: any) => {
            this.loadImage(image.image, element.productId)
          });
        });
        console.log("test", this.imgObject)
        this.selectedProduct = this.ProductList[0];
        this.selectedImage = 'https://bootdey.com/img/Content/avatar/avatar1.png';
        this.biddingList = this.selectedProduct.biddings;
        this.pageSlice = this.ProductList.slice(0, 10);
        console.log(this.ProductList);
      });
    }
  }

  isYourProduct(sellerId: string): boolean {
    return sellerId === this.userId;
  }

  isExpired(endTime: any) {
    let end = new Date(endTime);
    console.log(end)
    if (end > this.currentTime)
      return true;
    return false;
  }
  isJoining(chatRoomId: number) {
    var checked = true;
    this.ChatRoomUsers.forEach((element) => {
      if (element.chatRoomId === chatRoomId) {
        checked = false;
      }
    });
    return checked;
  }
  compareTime(startTime: any) {
    if (startTime && startTime < this.currentTime) {
      return true; // biddingStartTime is sooner than currentTime
    } else {
      return false; // biddingStartTime is equal to or later than currentTime, or biddingStartTime is null
    }
  }

  changeImage(image: any) {
    this.selectedImage = image;
  }

  setSelectedProduct(product: any) {
    this.selectedProduct = product;
    this.selectedImage = this.getImage(product.productId)[0];
    console.log(this.selectedProduct);
  }

  setSelectedBidding(product: any) {
    this.biddingList = [];
    product.biddings.forEach((element:any) => {
      if(element.biddingUserId == this.userId){
        this.biddingList.push(element);
      }
    });
  }

  ResultBidding(product: any) {
    let time = new Date(product.chatRoomProducts[product.chatRoomProducts.length - 1].biddingEndTime)
    if(time > this.currentTime){
      return 'BIDDING'
    }
    if(product.biddings[product.biddings.length - 1].biddingUserId == this.userId){
      return 'WIN';
    }    
    else{
      return 'LOSE';
    }   
  }

  onSortByItemClick(index: number): void {
    if (this.sortBy != index) {
      this.sortBy = index;
      this.sortListItem();
    }
  }

  onOrderByItemClick(index: number): void {
    if (this.orderBy != index) {
      this.orderBy = index;
      this.sortListItem();
    }
  }

  sortListItem() {
    switch (this.sortBy) {
      case 0: {
        console.log(this.sortBy);
        this.ProductList.sort((a, b) => a.name.localeCompare(b.name));
        console.log('name');
        break;
      }
      case 1: {
        console.log(this.sortBy);
        this.ProductList.sort((a, b) => a.initialPrice - b.initialPrice);
        console.log('price');
        break;
      }
      case 2: {
        console.log(this.sortBy);
        this.ProductList.sort((a, b) => a.minimumStep - b.minimumStep);
        console.log('step');
        break;
      }
      case 3: {
        console.log(this.sortBy);
        this.ProductList.sort((a, b) => {
          var biddingStartTimeA = null;
          var biddingStartTimeB = null;
          if (
            a.chatRoomProducts &&
            a.chatRoomProducts.length > 0 &&
            b.chatRoomProducts &&
            b.chatRoomProducts.length > 0
          ) {
            biddingStartTimeA = new Date(
              a.chatRoomProducts[0]?.biddingStartTime
            );
            biddingStartTimeB = new Date(
              b.chatRoomProducts[0]?.biddingStartTime
            );

            if (biddingStartTimeA && biddingStartTimeB) {
              return biddingStartTimeA.getTime() - biddingStartTimeB.getTime();
            }
          }

          return biddingStartTimeA ? -1 : biddingStartTimeB ? 1 : 0;
        });
        console.log('start');
        console.log(this.ProductList);
        break;
      }
      default: {
        break;
      }
    }

    if (this.orderBy == 1) {
      this.ProductList = this.ProductList.reverse();
      console.log(this.ProductList);
    }

    this.resetPaginator();
  }

  resetPaginator(): void {
    this.paginator.length = this.ProductList.length; // Set the length of the paginator
    this.paginator.pageIndex = 0; // Reset the page index to 0
    this.paginator.pageSize = 10;
    this.pageSlice = this.ProductList.slice(0, 10);
  }

  transform(value: number): string {
    // Assuming the value is in VND
    const formattedValue = value?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return formattedValue;
  }

  formatDate(dateString: string): any {
    console.log(dateString)
    const date = new Date(dateString);
    console.log(date)
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

  handleInput(event: any) {
    const inputValue: string = event.target.value;
  }

  onPageChange(event: PageEvent) {
    console.log(event);
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.ProductList.length) {
      endIndex = this.ProductList.length;
    }
    this.pageSlice = this.ProductList.slice(startIndex, endIndex);
  }
  onCancel(): void {
    this.CreateProductForm = this.fb.group({
      Name: ['', []],
      MinimumPrice: ['', []],
      MaximumPrice: ['', []],
      MinimumStep: ['', []],
      MaximumStep: ['', []],
      StartDate: ['', []],
      EndDate: ['', []],
    });
    this.productService.getProductsWithStatus(2).subscribe((data: any) => {
      console.log(data);
      this.ProductList = data.response;
      this.selectedProduct = this.ProductList[0];
      this.selectedImage =
        'productImages/' + this.selectedProduct.images[0].image;
      this.pageSlice = this.ProductList.slice(0, 2);
    });
  }

  onSubmit(): void {
    console.log(this.CreateProductForm.value);

    // if(this.CreateProductForm.value.StartDate && this.CreateProductForm.value.EndDate){
    //   if(this.CreateProductForm.value.StartDate >= this.CreateProductForm.value.EndDate){
    //     var answer = window.alert("Error");
    //   }
    // }

    this.ProductList = this.ProductSave;

    var result = this.CreateProductForm.value;
    var searchName = result.Name ? result.Name : '';
    var searchMaxPrice = result.MaximumPrice
      ? result.MaximumPrice
      : Number.MAX_VALUE;
    var searchMinPrice = result.MinimumPrice
      ? result.MinimumPrice
      : Number.MIN_VALUE;
    var searchMaxStep = result.MaximumStep
      ? result.MaximumStep
      : Number.MAX_VALUE;
    var searchMinStep = result.MinimumStep
      ? result.MinimumStep
      : Number.MIN_VALUE;
    var searchStart = new Date(result.StartDate ? result.StartDate : 0);
    var searchEnd = new Date(
      result.EndDate ? result.EndDate : '9999-12-31T23:59:59.999'
    );

    console.log(
      searchName,
      searchMaxPrice,
      searchMinPrice,
      searchMaxStep,
      searchMinStep,
      searchStart,
      searchEnd
    );

    var listPd: any[] = [];
    this.ProductList.forEach((element) => {
      console.log(element);
      var start = new Date(element.chatRoomProducts[0].biddingStartTime);
      var end = new Date(element.chatRoomProducts[0].biddingEndTime);
      if (
        element.name.includes(searchName) &&
        element.initialPrice >= searchMinPrice &&
        element.initialPrice <= searchMaxPrice &&
        element.minimumStep >= searchMinStep &&
        element.minimumStep <= searchMaxStep &&
        start >= searchStart &&
        end <= searchEnd
      )
        listPd.push(element);
    });

    this.ProductList = listPd;

    this.sortListItem();
  }
}
