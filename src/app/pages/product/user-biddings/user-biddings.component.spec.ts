import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBiddingsComponent } from './user-biddings.component';

describe('UserBiddingsComponent', () => {
  let component: UserBiddingsComponent;
  let fixture: ComponentFixture<UserBiddingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserBiddingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserBiddingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
