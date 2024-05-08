import { MatDialog } from "@angular/material/dialog";
import { FirebaseService } from "../../services/firebase.service";
import { RecipeService } from "../../services/recipe.service";
import { Component, OnInit } from "@angular/core";
import { Observable, map, of } from "rxjs";
import { Recipe } from "../../models/recipe";

interface MealPlan {
  day: string;
  meals: {
    [mealType: string]: Recipe[];
  };
}
@Component({
  selector: 'app-meal-planning',
  templateUrl: './meal-planning.component.html',
  styleUrl: './meal-planning.component.css'
})
export class MealPlanningComponent implements OnInit{
  recipes$: Observable<any[]> = of([]);
  mealPlans: MealPlan[] = [];
  showMenu:boolean=true;
  filterText:any='';
  selectedDay: string = '';
  selectedMealType: 'Breakfast' | 'Lunch' | 'Dinner' | '' = '';
  similarRecipes$: Observable<any[]> = of([]);

  constructor(private recipeService: RecipeService, private firebaseService: FirebaseService) {}
  ngOnInit(): void {
    this.loadMealPlans();
  }

  loadMealPlans() {
    const data = localStorage.getItem('mealPlans');
    if (data) {
      this.mealPlans = JSON.parse(data);
    }
  }

  saveMealPlans() {
    localStorage.setItem('mealPlans', JSON.stringify(this.mealPlans));
  }
  onSelectMealType(mealType: 'Breakfast' | 'Lunch' | 'Dinner') {
    this.selectedMealType = mealType;
    this.recipes$ = this.recipeService.getRecipesByMealType(mealType);
    this.recipes$.subscribe(data => {
        console.log('Recipes fetched:', data);
        if (data.length === 0) {
            console.log('No recipes found for meal type:', mealType);
        }
    }, error => {
        console.error('Error fetching recipes:', error);
    });
}


addMealToPlan(recipe: any) {
  if (this.selectedDay && this.selectedMealType && recipe && recipe.title && this.firebaseService.getCurrentUserId()) {
    this.firebaseService.addMealToDay(this.selectedDay, this.selectedMealType, recipe)
      .then(() => {
        console.log('Meal added to plan successfully');
        this.similarRecipes$ = this.recipeService.getRecipesByTags(recipe.tags).pipe(
          map(recipes => recipes.filter(r => r.id !== recipe.id))
        );
      })
      .catch(error => console.error('Error adding meal to plan:', error));
  } else {
    console.error('Please select a day, a meal type, ensure a recipe is selected and you are logged in before adding a recipe');
  }
  if (!this.selectedDay || !this.selectedMealType) {
    console.error('Please select a day and a meal type before adding a recipe');
    return;
  }
  // Find if there's already an entry for the selected day
   let dayPlan = this.mealPlans.find(p => p.day === this.selectedDay);
    if (!dayPlan) {
      dayPlan = { day: this.selectedDay, meals: {} };
      this.mealPlans.push(dayPlan);
    }
    if (!dayPlan.meals[this.selectedMealType]) {
      dayPlan.meals[this.selectedMealType] = [];
    }
    dayPlan.meals[this.selectedMealType].push(recipe);
  this.saveMealPlans();
}


}