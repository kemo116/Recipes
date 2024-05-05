import { Component, OnInit } from '@angular/core';
// import { RecipeSavingService } from '../../services/recipe-saving.service';
import { FirebaseService } from '../../services/firebase.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-saved-recipes',
  templateUrl: './saved-recipes.component.html',
  styleUrls: ['./saved-recipes.component.css']
})
export class SavedRecipesComponent  implements OnInit  {
  savedRecipes: any[] = [];
  userId: string | null = null;
  showMenu :boolean =true;

  constructor(private firebaseService: FirebaseService, private router:Router, private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.userId = this.firebaseService.getCurrentUserId();
    if (this.userId) {
        this.firebaseService.getUserData(this.userId).then(user => {
            if (user && user.savedRecipes) {
                this.savedRecipes = user.savedRecipes;
                console.log(this.savedRecipes); // Check the structure here
            }
        }).catch(error => {
            console.error('Error fetching user data:', error);
        });
    }
  }
  showDetails(recipe: any): void {
    if (!recipe.title) {
        console.error("No title found for the recipe:", recipe);
        return;
    }

    // Fetch the recipe by title from Firestore
    this.recipeService.getRecipeByTitle(recipe.title).subscribe(
        (foundRecipes) => {
            if (foundRecipes.length > 0) {
                const foundRecipe = foundRecipes[0]; // Take the first match
                this.router.navigate(['/recipe', foundRecipe.id]);
            } else {
                console.error("No recipe found with title:", recipe.title);
            }
        },
        (error) => {
            console.error("Error fetching recipe by title:", error);
        }
    );
}


 
}
