import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomDetailsComponent } from './chat-room-details.component';

describe('ChatRoomDetailsComponent', () => {
  let component: ChatRoomDetailsComponent;
  let fixture: ComponentFixture<ChatRoomDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatRoomDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
