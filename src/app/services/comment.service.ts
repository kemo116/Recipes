import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private newCommentSubject = new BehaviorSubject<string>('');

  get newComment$() {
    return this.newCommentSubject.asObservable();
  }

  addComment(comment: string) {
    this.newCommentSubject.next(comment);
  }
}
