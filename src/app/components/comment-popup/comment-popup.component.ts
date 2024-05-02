import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HomeComponent } from '../home/home.component';
import { CommentService } from '../../services/comment.service';
interface CommentPopupData {
  recipe: any; 
  comments: string[];
}
@Component({
  selector: 'app-comment-popup',
  templateUrl: './comment-popup.component.html',
  styleUrl: './comment-popup.component.css'
})

export class CommentPopupComponent {
  commentsData: CommentPopupData;
  newComment: string = '';

  constructor(
    public dialogRef: MatDialogRef<CommentPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CommentPopupData,
    private commentService: CommentService
  ) {
    this.commentsData = data;
  }
  
  addComment(): void {
    if (this.newComment.trim() !== '') {
      this.commentService.addComment(this.newComment);
      this.dialogRef.close(this.newComment);
      // Clear the input field
      this.newComment = '';
    }
  }}
