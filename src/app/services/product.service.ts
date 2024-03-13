import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

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
    // forget to add images
    let url = 'http://localhost:5274/api/Product/create';
    return this.http.post(url, data);
  }
  getProductListFromChat(chatRoomId: number) {
    let url = `http://localhost:5274/api/chatroom/${chatRoomId}/products`;
    return this.http.get(url);
  }
}
