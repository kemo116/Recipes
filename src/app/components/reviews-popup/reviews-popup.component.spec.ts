import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsPopupComponent } from './reviews-popup.component';

describe('ReviewsPopupComponent', () => {
  let component: ReviewsPopupComponent;
  let fixture: ComponentFixture<ReviewsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewsPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
