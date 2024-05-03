import { Component, OnInit } from '@angular/core';
import { RecipeSavingService } from '../../services/recipe-saving.service';
import { FirebaseService } from '../../services/firebase.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-saved-recipes',
  templateUrl: './saved-recipes.component.html',
  styleUrls: ['./saved-recipes.component.css']
})
export class SavedRecipesComponent implements OnInit {
  savedRecipes: any[] = [];
  currentUserId: string | null = null;
  recipe$: Observable<any> = new Observable();
  showMenu: boolean = true;

  constructor(
    private recipeSavingService: RecipeSavingService,
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    // Get the current user's ID
    this.currentUserId = this.firebaseService.getCurrentUserId();

    if (this.currentUserId) {
      // Fetch saved recipes for the current user
      this.recipeSavingService.getSavedRecipes(this.currentUserId).subscribe(savedRecipes => {
        this.savedRecipes = savedRecipes;
      });
    }
  }
}
