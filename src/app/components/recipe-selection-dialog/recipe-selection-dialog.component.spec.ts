import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSelectionDialogComponent } from './recipe-selection-dialog.component';

describe('RecipeSelectionDialogComponent', () => {
  let component: RecipeSelectionDialogComponent;
  let fixture: ComponentFixture<RecipeSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeSelectionDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecipeSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
