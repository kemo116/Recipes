import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  private newreviewSubject = new BehaviorSubject<string>('');

  get newReview$() {
    return this.newreviewSubject.asObservable();
  }

  addReview(review: string) {
    this.newreviewSubject.next(review);
  }
}
