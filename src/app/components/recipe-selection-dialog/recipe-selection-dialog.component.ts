import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-recipe-selection-dialog',
  templateUrl: './recipe-selection-dialog.component.html',
  styleUrl: './recipe-selection-dialog.component.css'
})
export class RecipeSelectionDialogComponent implements OnInit {
  selectedRecipe: any;  // This will hold the currently selected recipe

  constructor(
    public dialogRef: MatDialogRef<RecipeSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { recipes: any[] }
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmSelection() {
    this.dialogRef.close(this.selectedRecipe);
  }

  onSelectRecipe(recipe: any): void {
    this.selectedRecipe = recipe;  // Set the selected recipe
  }
  
}
