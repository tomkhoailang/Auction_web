import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}
  createProduct(formGroup: FormGroup, files: FileList) {
    const data = new FormData();

    data.append('Name', formGroup.value.Name);
    data.append('Description', formGroup.value.Description);
    data.append('InitialPrice', formGroup.value.InitialPrice);
    data.append('MinimumStep', formGroup.value.MinimumStep);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      data.append('Files[]', file, file.name);
    }
    // forget to add images
    let url = 'http://localhost:5274/api/Product';
    return this.http.post(url, data);
  }

  editProduct(formGroup: FormGroup, files: FileList, productId: number) {
    const data = new FormData();

    data.append('Name', formGroup.value.Name);
    data.append('Description', formGroup.value.Description);
    data.append('InitialPrice', formGroup.value.InitialPrice);
    data.append('MinimumStep', formGroup.value.MinimumStep);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      data.append('Files[]', file, file.name);
    }
    // forget to add images
    let url = `http://localhost:5274/api/Product/${productId}`;
    return this.http.patch(url, data);
  }

  getProductListFromChat(chatRoomId: number) {
    let url = `http://localhost:5274/api/chatroom/${chatRoomId}/products`;
    return this.http.get(url);
  }
  getProductListFromUser() {
    let url = `http://localhost:5274/api/product/user`;
    return this.http.get(url);
  }
  getBiddingFares() {
    let url = `http://localhost:5274/api/Product/biddingfares`;
    return this.http.get(url);
  }
  deleteProduct(productId: number) {
    let url = `http://localhost:5274/api/Product/${productId}`;
    return this.http.delete(url);
  }

  getImage(imgName: string) {
    let url = `http://localhost:5274/api/Product/images?imgName=${imgName}`;
    return this.http.get(url, { responseType: 'blob' });
  }
  getProduct(productId: number) {
    let url = `http://localhost:5274/api/Product/${productId}`;
    return this.http.get(url);
  }

  getProductsWithStatus(statusId: number) {
    let url = `http://localhost:5274/api/Product/status/${statusId}`;
    return this.http.get(url);
  }

  continueBidding(productId: number) {
    // forget to add images
    let url = `http://localhost:5274/api/Product/${productId}/productStatuses`;
    return this.http.post(url, productId);
  }

  getBiddingsProducts() {
    let url = `http://localhost:5274/api/Product/history`;
    return this.http.get(url);
  }
}
