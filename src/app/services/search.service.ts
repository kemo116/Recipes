import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchText = new BehaviorSubject<string>('');
  currentSearchText = this.searchText.asObservable();

  constructor() {}

  updateSearchText(text: string): void {
    this.searchText.next(text);
  }
}