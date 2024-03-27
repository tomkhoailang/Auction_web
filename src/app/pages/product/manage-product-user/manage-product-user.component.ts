import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import * as fs from 'fs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Console, debug, log } from 'console';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { fileURLToPath } from 'url';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-manage-product-user',
  templateUrl: './manage-product-user.component.html',
  styleUrl: './manage-product-user.component.css',
})
export class ManageProductUserComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  ProductList: any[] = [];
  StatusList: any[] = [];
  ChosenList: any[] = [];
  areSubmit: any;
  userId: any;
  productIdEdit: any;
  CreateProductForm!: FormGroup;
  files: any = [];
  uploadedImages: string[] = [];
  currentDate: Date = new Date();

  pageSlice: any[] = [];
  listWaiting: any[] = [];
  listRegister: any[] = [];
  listExpire: any[] = [];
  listSold: any[] = [];
  listImages: any[] = [];
  imgObject: any[] = [];
  activeButtonIndex: number = 1;
  activeTable: number = 1;
  selectedRowIndex: number = -1;
  productToAddRoom: any[] = [];
  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private productService: ProductService,
    private http: HttpClient,
    private location: Location,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit(): void {
    this.CreateProductForm = this.fb.group({
      Name: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      InitialPrice: ['', [Validators.required]],
      MinimumStep: ['', [Validators.required]],
    });
    if (typeof document !== 'undefined') {
      this.userId = sessionStorage?.getItem('id');
      console.log(this.userId);
      this.areSubmit = true;
      this.productService.getProductListFromUser().subscribe((data: any) => {
        console.log(data);

        if (data) {
          this.ProductList = data.response;
          console.log(this.ProductList);
          this.ProductList.forEach(element => {

            element.images.forEach((image: any) => {
              this.loadImage(image.image, element.productId)
            });
          });
          console.log("test", this.imgObject)

          this.ProductList.forEach((element) => {
            switch (
            element.productInStatuses[element.productInStatuses.length - 1]
              .productStatusId
            ) {
              case 1: {
                console.log(
                  element.productInStatuses[
                    element.productInStatuses.length - 1
                  ].productStatusId
                );
                this.listWaiting.push(element);
                break;
              }
              case 2: {
                console.log(
                  element.chatRoomProducts[element.chatRoomProducts.length - 1]
                    .biddingEndTime
                );
                var endDate = new Date(
                  element.chatRoomProducts[
                    element.chatRoomProducts.length - 1
                  ].biddingEndTime
                );
                if (endDate <= this.currentDate) {
                  if (element.biddings && element.biddings.length > 0) {
                    this.listSold.push(element);
                  }
                  else {
                    this.listExpire.push(element);
                  }
                } else {
                  this.listRegister.push(element);
                }
                break;
              }
              default: {
                break;
              }
            }
          });

          this.pageSlice = this.listWaiting.slice(0, 10);
          this.ChosenList = this.listWaiting;
        } else {
          window.alert('Null data');
        }
      });

      this.productService.getStatusList().subscribe((data1: any) => {
        this.StatusList = data1.response;
      });

      setInterval(() => {
        this.currentDate = new Date();
      }, 1000);
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

  ContinueBidding(productId: number) {
    this.productService.continueBidding(productId).subscribe({
      next: () => { },
      error: () => { },
      complete: () => {
        var answer = window.alert('Success');
        this.onCancel();
        // debugger;

        window.location.reload();
      },
    });
  }

  SendDataProductToEdit(productId: number, index: number): void {
    this.productIdEdit = productId;
    this.areSubmit = false;
    this.selectedRowIndex = index;
    this.CreateProductForm.patchValue({
      Name: this.ProductList.at(index)?.name?.toString(),
      Description: this.ProductList.at(index)?.description?.toString(),
      InitialPrice: this.ProductList.at(index)?.initialPrice?.toString(), // Example value
      MinimumStep: this.ProductList.at(index)?.minimumStep?.toString(), // Example value
    });

    this.uploadedImages = [];
    this.files = [];
    const images = this.getImage(productId);
    images.forEach((image: any) => {
      this.uploadedImages.push(image);
      this.files.push(image);
    });
    console.log("upload images ", this.uploadedImages)
    console.log("upload files ", this.files)

    // for (let i = 0; i < this.ProductList.at(index).images.length; i++) {
    //   const imageUrl = ('productImages/' +
    //     this.ProductList.at(index)?.images[i].image) as string; // Adjust the path to your image file
    //   fetch(imageUrl)
    //     .then((response) => {
    //       console.log('this is res', response);
    //       return response.blob();
    //     })
    //     .then((blob) => {
    //       console.log(this.ProductList.at(index)?.images[i].image);
    //       const file = new File(
    //         [blob],
    //         this.ProductList.at(index)?.images[i].image as string
    //       ); // Create a File object

    //       this.files.push(file);
    //       this.displayImage(file);
    //     })
    //     .catch((error) => {
    //       console.log(imageUrl);
    //       console.error('Error fetching image:', error);
    //     });
    // }

  }
  EditProductInfo(): void {
    this.files.forEach((element: any, index: number) => {
      if(this.isBase64(element)){
        const file = this.base64ToBlob(element,"image/jpeg");
        if(file){
          this.files[index] = file;
        }
        console.log("element: ", this.files[index])
      }
    });
    console.log("after convert ", this.files)
    this.productService
      .editProduct(this.CreateProductForm, this.files, this.productIdEdit)
      .subscribe({
        next: () => { },
        error: () => { },
        complete: () => {
          var answer = window.alert('Success');
          this.onCancel();
          // debugger;

          window.location.reload();
        },
      });
  }
  onCancel(): void {
    this.CreateProductForm = this.fb.group({
      Name: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      InitialPrice: ['', [Validators.required]],
      MinimumStep: ['', [Validators.required]],
    });
    this.uploadedImages = [];
    console.log(this.uploadedImages);
    this.files = [];
    this.areSubmit = true;
    this.productIdEdit = null;
  }

  getCurrentDateTime(): string {
    const now = new Date();
    // Format the current date and time to match the format required by datetime-local input
    const formattedDateTime = `${now.getFullYear()}-${this.padZero(
      now.getMonth() + 1
    )}-${this.padZero(now.getDate())}T${this.padZero(
      now.getHours()
    )}:${this.padZero(now.getMinutes())}`;
    return formattedDateTime;
  }

  padZero(num: number): string {
    return (num < 10 ? '0' : '') + num;
  }

  DeleteProduct(productId: number, index: number): void {
    var answer = window.confirm('Save data?');
    if (answer) {
      this.ProductList.splice(index, 1);
      this.productService.deleteProduct(productId).subscribe((a: any) => { });
      if (index === this.selectedRowIndex) {
        this.selectedRowIndex = -1;
      }
    } else {
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

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const files = inputElement.files as FileList;
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
        this.displayImage(files[i]);
      }
    }
    console.log('After add file',this.files);
  }
  displayImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImages.push(reader.result as string);
      // console.log(file);
    };
    reader.readAsDataURL(file);
  }
  deleteImage(index: number): void {
    this.files.splice(index, 1);
    this.uploadedImages.splice(index, 1);

    const inputElement = document.getElementById(
      'imageUpload'
    ) as HTMLInputElement;

    inputElement.value = '';
    inputElement.files = null;

    if (this.files.length > 0) {
      const fileList = new DataTransfer();
      this.files.forEach((file: File) => {
        const blob = new Blob([file], { type: file.type });
        fileList.items.add(new File([blob], file.name));
      });
      inputElement.files = fileList.files;
    }

    console.log('after delete', this.files, this.uploadedImages)
  }

  setActiveTable(tableNumber: number) {
    this.activeTable = tableNumber;
    this.activeButtonIndex = tableNumber;
    switch (tableNumber) {
      case 1: {
        this.pageSlice = this.listWaiting.slice(0, 10);
        this.paginator.length = this.listWaiting.length;
        this.ChosenList = this.listWaiting;
        break;
      }
      case 2: {
        this.pageSlice = this.listRegister.slice(0, 10);
        this.paginator.length = this.listRegister.length;
        this.ChosenList = this.listRegister;
        break;
      }
      case 3: {
        this.pageSlice = this.listSold.slice(0, 10);
        this.paginator.length = this.listSold.length;
        this.ChosenList = this.listSold;
        break;
      }
      case 4: {
        this.pageSlice = this.listExpire.slice(0, 10);
        this.paginator.length = this.listExpire.length;
        this.ChosenList = this.listExpire;
        break;
      }
      default: {
        break;
      }
    }

    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 10;
  }
  base64ToBlob(base64Data: string, contentType: string): File {
    console.log(base64Data)
    contentType = contentType || '';
    const sliceSize = 512;

    const base64Index = base64Data.indexOf(';base64,');
    if (base64Index !== -1) {
        base64Data = base64Data.slice(base64Index + 8);
    }

    const byteCharacters = atob(base64Data);
    const byteArrays: Uint8Array[] = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    if (!contentType.startsWith('image/') && blob.type.startsWith('image/')) {
      contentType = blob.type;
  }

  const file = new File([blob], 'image.jpeg', { type: contentType });
  console.log(file)
    return file;
  }
  isBase64(file: string) {
    // Regular expression to match a base64 string
    const base64Regex = /^data:(.+);base64,(.*)$/;
    
    // Check if the file content matches the base64 regex
    return base64Regex.test(file);
  }  
  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.ChosenList.length) {
      endIndex = this.ChosenList.length;
    }
    this.pageSlice = this.ChosenList.slice(startIndex, endIndex);
  }
  onSubmit(): void {
    
    this.productService
      .createProduct(this.CreateProductForm, this.files)
      .subscribe({
        next: () => { },
        error: () => { },
        complete: () => {
          var answer = window.alert('Success');
          this.onCancel();
          window.location.reload();
        },
      });
  }
}
