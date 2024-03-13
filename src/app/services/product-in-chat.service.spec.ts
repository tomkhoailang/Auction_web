import { TestBed } from '@angular/core/testing';

import { ProductInChatService } from './product-in-chat.service';

describe('ProductInChatService', () => {
  let service: ProductInChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductInChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
