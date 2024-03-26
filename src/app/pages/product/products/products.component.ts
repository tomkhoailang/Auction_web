import { Component, ViewChild } from '@angular/core';
import { ChatRoomService } from '../../../services/chat-room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  sortBy: number = -1; // Initial value for sortBy
  orderBy: number = 0; // Initial value for orderBy

  sortList: string[] = ['Name', 'Initial Price', 'Minimum Step', 'Start Date'];
  orderList: string[] = ['A - Z', 'Z - A'];
  ProductList: any[] = [];
  ProductSave: any[] = [];
  pageSlice: any[] = [];
  selectedProduct: any;
  ChatRoom: any;
  ChatRoomId: any;
  selectedImage: any;
  currentTime: any;
  StatusList: any[] = [];
  userId: any;
  files: any = [];
  uploadedImages: string[] = [];
  CreateProductForm!: FormGroup;
  constructor(
    private chatRoomService: ChatRoomService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private http: HttpClient
  ) { }
  ngOnInit(): void {
    this.CreateProductForm = this.fb.group({
      Name: ['', []],
      MinimumPrice: ['', []],
      MaximumPrice: ['', []],
      MinimumStep: ['', []],
      MaximumStep: ['', []],
      StartDate: ['', []],
      EndDate: ['', []]
    });
    if (typeof document != 'undefined') {
      this.currentTime = new Date(Date.now());

      this.productService.getProductsWithStatus(2).subscribe((data: any) => {
        console.log(data);
        this.ProductList = data.response;
        this.ProductSave = data.response;
        this.selectedProduct = this.ProductList[0];
        this.selectedImage = 'productImages/' + this.selectedProduct.images[0].image;
        this.pageSlice = this.ProductList.slice(0,2);
        console.log(this.ProductList)
      })
    }

  }

  compareTime(startTime: any){
    if (startTime && startTime < this.currentTime) {
      return true; // biddingStartTime is sooner than currentTime
    } else {
      return false; // biddingStartTime is equal to or later than currentTime, or biddingStartTime is null
    }
  }

  changeImage(image: any) {
    this.selectedImage = 'productImages/' + image;
  }

  setSelectedProduct(product: any) {
    this.selectedProduct = product;
    console.log(this.selectedProduct)
  }

  joinChatRoom(chatRoomId: number) {
    console.log(chatRoomId);
    this.chatRoomService.joinChatRoom(chatRoomId).subscribe({
      next: () => { },
      error: () => { },
      complete: () => { var answer = window.alert("Success"); window.location.reload() }
    })
  }

  onSortByItemClick(index: number): void {
    if(this.sortBy != index){
      this.sortBy = index;
      this.sortListItem();
    }

  }

  onOrderByItemClick(index: number): void {
    if(this.orderBy != index){
      this.orderBy = index; 
      this.sortListItem();
    }

  }

  sortListItem(){
    switch(this.sortBy){
      case 0:{
        console.log(this.sortBy);
        this.ProductList.sort((a, b) => a.name.localeCompare(b.name));
        console.log("name");
        break;
      }
      case 1:{
        console.log(this.sortBy);
        this.ProductList.sort((a, b) => a.initialPrice - b.initialPrice);
        console.log("price");
        break;
      }
      case 2:{
        console.log(this.sortBy);
        this.ProductList.sort((a, b) => a.minimumStep - b.minimumStep);
        console.log("step");
        break;
      }
      case 3:{
        console.log(this.sortBy);
        this.ProductList.sort((a, b) => {
          var biddingStartTimeA = null;
          var biddingStartTimeB = null;
          if (a.chatRoomProducts && a.chatRoomProducts.length > 0 &&
              b.chatRoomProducts && b.chatRoomProducts.length > 0) {

            biddingStartTimeA = new Date(a.chatRoomProducts[0]?.biddingStartTime);
            biddingStartTimeB = new Date(b.chatRoomProducts[0]?.biddingStartTime);
        
            if (biddingStartTimeA && biddingStartTimeB) {

              return biddingStartTimeA.getTime() - biddingStartTimeB.getTime();
            }
          }
          
          return (biddingStartTimeA ? -1 : (biddingStartTimeB ? 1 : 0));
        });
        console.log("start");
        console.log(this.ProductList);
        break;
      }
      default:{
        break;
      }
    }

    if(this.orderBy == 1){
      this.ProductList = this.ProductList.reverse();
      console.log(this.ProductList);
    }

    this.resetPaginator();
  }

  resetPaginator(): void {
    
    this.paginator.length = this.ProductList.length; // Set the length of the paginator
    this.paginator.pageIndex = 0; // Reset the page index to 0
    this.paginator.pageSize = 2;
    this.pageSlice = this.ProductList.slice(0,2);
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

  handleInput(event: any) {
    const inputValue: string = event.target.value;
  }

  onPageChange(event: PageEvent) {
    console.log(event);
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.ProductList.length){
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
      EndDate: ['', []]
    });
    this.productService.getProductsWithStatus(2).subscribe((data: any) => {
      console.log(data);
      this.ProductList = data.response;
      this.selectedProduct = this.ProductList[0];
      this.selectedImage = 'productImages/' + this.selectedProduct.images[0].image;
      this.pageSlice = this.ProductList.slice(0,2);
    })
  }

  onSubmit(): void {
    console.log(this.CreateProductForm.value)

    // if(this.CreateProductForm.value.StartDate && this.CreateProductForm.value.EndDate){
    //   if(this.CreateProductForm.value.StartDate >= this.CreateProductForm.value.EndDate){
    //     var answer = window.alert("Error");
    //   }
    // }

    this.ProductList = this.ProductSave;

    var result = this.CreateProductForm.value;
    var searchName = result.Name?result.Name:'';
    var searchMaxPrice = result.MaximumPrice?result.MaximumPrice:Number.MAX_VALUE;
    var searchMinPrice = result.MinimumPrice?result.MinimumPrice:Number.MIN_VALUE;
    var searchMaxStep = result.MaximumStep?result.MaximumStep:Number.MAX_VALUE;
    var searchMinStep = result.MinimumStep?result.MinimumStep:Number.MIN_VALUE;
    var searchStart = new Date(result.StartDate?result.StartDate:0);
    var searchEnd = new Date(result.EndDate?result.EndDate:'9999-12-31T23:59:59.999');

    console.log(searchName, searchMaxPrice, searchMinPrice, searchMaxStep, searchMinStep,searchStart, searchEnd);

    var listPd: any[] = [];
    this.ProductList.forEach(element => {
      console.log(element)
      var start = new Date(element.chatRoomProducts[0].biddingStartTime);
      var end = new Date(element.chatRoomProducts[0].biddingEndTime);
      if(element.name.includes(searchName)
      && element.initialPrice >= searchMinPrice
      && element.initialPrice <= searchMaxPrice
      && element.minimumStep >= searchMinStep
      && element.minimumStep <= searchMaxStep
      && start >= searchStart
      && end <= searchEnd)
      listPd.push(element);
    });

    this.ProductList = listPd;

    this.sortListItem();
  }
}

