import { MatDialog } from "@angular/material/dialog";
import { FirebaseService } from "../../services/firebase.service";
import { RecipeService } from "../../services/recipe.service";
import { RecipeSelectionDialogComponent } from "../recipe-selection-dialog/recipe-selection-dialog.component";
import { Component } from "@angular/core";


@Component({
  selector: 'app-meal-planning',
  templateUrl: './meal-planning.component.html',
  styleUrl: './meal-planning.component.css'
})
export class MealPlanningComponent {
  showMenu: boolean = true;
  days: string[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  selectedDay: string | null = null;
  userId: string | null = null;  // Assuming user ID is managed globally or via a service

  constructor(private firebaseService: FirebaseService, private recipeService: RecipeService,private dialog: MatDialog,) {}

  selectDay(day: string) {
    this.selectedDay = day;
    // Optionally, load existing meal plan for the selected day
  }

  addMeal(mealType: string) {
    if (!this.selectedDay ) {
        console.log('Please select a day and ensure you are logged in.');
        return;
    }
  
    this.recipeService.getRecipesByMealType(mealType).subscribe(recipes => {
        const dialogRef = this.dialog.open(RecipeSelectionDialogComponent, {
            width: '250px',
            data: { recipes }
        });
  
        dialogRef.afterClosed().subscribe(selectedRecipe => {
            if (selectedRecipe) {
                this.firebaseService.updateUserMealPlan(this.userId!, this.selectedDay!, mealType, selectedRecipe)
                    .then(() => console.log('Meal plan updated successfully'))
                    .catch(error => console.error('Error updating meal plan:', error));
            }
        });
    });
}


}