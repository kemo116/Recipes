import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommentService } from '../../services/comment.service';
import { ReviewsService } from '../../services/reviews.service';
interface ReviewsPopupData {
  recipe: any; 
  reviews: string[];
}
@Component({
  selector: 'app-reviews-popup',
  templateUrl: './reviews-popup.component.html',
  styleUrl: './reviews-popup.component.css'
})

export class ReviewsPopupComponent {
  reviewsData: ReviewsPopupData;
  newReview: string = '';

  constructor(
    public dialogRef: MatDialogRef<ReviewsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReviewsPopupData,
    private reviewsService: ReviewsService
  ) {
    this.reviewsData = data;
  }
  
  addReview(): void {
    if (this.newReview.trim() !== '') {
      this.reviewsService.addReview(this.newReview);
      this.dialogRef.close(this.newReview);
      // Clear the input field
      this.newReview = '';
    }
  }}