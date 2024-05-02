import { TestBed } from '@angular/core/testing';

import { RecipeSavingService } from './recipe-saving.service';

describe('RecipeSavingService', () => {
  let service: RecipeSavingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeSavingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
