import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.css',
})
export class CreateComponent implements OnInit {
  CreateProductForm!: FormGroup;
  files: any = [];
  uploadedImages: string[] = [];
  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.CreateProductForm = this.fb.group({
      Name: ['', [Validators.required]],
      Description: ['', [Validators.required]],
      InitialPrice: ['', [Validators.required]],
      MinimumStep: ['', [Validators.required]],
    });
  }
  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      this.files = [];
      this.uploadedImages = [];
      const files = inputElement.files as FileList;
      for (let i = 0; i < files.length; i++) {
        this.files.push(files[i]);
        this.displayImage(files[i]);
      }
    }
  }
  displayImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadedImages.push(reader.result as string);
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
  }

  onSubmit(): void {
    this.productService
      .createProduct(this.CreateProductForm, this.files)
      .subscribe({
        next: () => {},
        error: () => {},
        complete: () => {},
      });
  }
}
