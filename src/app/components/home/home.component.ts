import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/internal/operators/finalize';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommentPopupComponent } from '../comment-popup/comment-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { RecipeSavingService } from '../../services/recipe-saving.service';
import firebase from 'firebase/compat';
import { ReviewsPopupComponent } from '../reviews-popup/reviews-popup.component';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  bgImageUrl!: string;
  recipes: any[] = [];
  filterText = '';
  newComment: string = '';
  showMenu: boolean = true; // Default to true, meaning menu is visible
  currentUserId: string|null=null;
  constructor(
    public firebaseService: FirebaseService, 
    private recipeService: RecipeService, 
    private router: Router, 
    private storage: AngularFireStorage,
    private dialog: MatDialog,
    private firestore:AngularFirestore,
    // private recipeSavingService: RecipeSavingService
    
  ) { }

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe(data => {
      this.recipes = data;
    });
    // Fetch background image URL
    const ref = this.storage.refFromURL('https://firebasestorage.googleapis.com/v0/b/task-c5d3d.appspot.com/o/food-4k-anl1yr892h6ccjeb.jpg?alt=media&token=3c5d2414-b424-46e6-99b8-ef5dd7b29203');
    ref.getDownloadURL().pipe(
      finalize(() => console.log('Image URL fetched successfully'))
    ).subscribe(url => {
      this.bgImageUrl = url;
    });
    this.currentUserId = this.firebaseService.getCurrentUserId();
    this.recipeService.getRecipes().subscribe(allRecipes => {
      this.currentUserId = this.firebaseService.getCurrentUserId();
      if (this.currentUserId) {
        this.firebaseService.getUserData(this.currentUserId).then(user => {
          const savedRecipesTitles = user && user.savedRecipes ? user.savedRecipes.map((r: { title: any; }) => r.title) : [];
          this.recipes = allRecipes.map(recipe => {
            recipe.saved = savedRecipesTitles.includes(recipe.title); // Set saved state
            return recipe;
          });
        }).catch(error => {
          console.error('Error fetching user data:', error);
        });
      } else {
        this.recipes = allRecipes; // Load recipes normally if no user or not logged in
      }
    });
  }
  showDetails(recipe: any): void {
    this.router.navigate(['/recipe', recipe.id]);
  }
  // Function to toggle recipe saved state
  toggleRecipeSavedState(recipe: any): void {
    if (!this.currentUserId) {
        console.error("User must be logged in to toggle saved recipes.");
        return;
    }

    const newState = !recipe.saved; // Toggle the state

    this.firebaseService.getUserData(this.currentUserId).then(user => {
        let savedRecipes = user.savedRecipes || [];
        if (newState) {
            // Add to saved recipes, ensure to include the 'id'
            savedRecipes.push({
                id: recipe.id, // Save the recipe ID here
                title: recipe.title,
                description: recipe.description,
                rating: recipe.ratings,
                imageUrl: recipe.imageUrl
            });
        } else {
            // Remove from saved recipes
            savedRecipes = savedRecipes.filter((r: { id: any; }) => r.id !== recipe.id);
        }

        this.firebaseService.updateUserSavedRecipes(this.currentUserId!, savedRecipes).then(() => {
            recipe.saved = newState; // Update local state
            console.log('Saved recipes updated successfully.');
        }).catch(error => {
            console.error('Error updating saved recipes:', error);
        });
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}

  



  // Function to handle liking a recipe
  likeRecipe(recipe: any): void {
    // Update the like count in the database
    const recipeRef = this.firestore.collection('recipes').doc(recipe.id);
    recipeRef.update({ likes: recipe.likes + 1 }); // Assuming 'likes' is the field to update
  }
  openCommentPopup(recipe: any): void {
    const dialogRef = this.dialog.open(CommentPopupComponent, {
      width: '500px',
      data: { recipe, comments: recipe.comments } // Pass recipe data along with comments
    });
  
    dialogRef.afterClosed().subscribe(newComment => {
      if (newComment) {
        this.addCommentToRecipe(recipe, newComment);
      }
    });
    
  }
  
  addCommentToRecipe(recipe: any, newComment: string): void {
    // Update the comments array in the recipe object
    recipe.comments.push(newComment);
  
    // Update the comments in the Firestore document
    const recipeRef = this.firestore.collection('recipes').doc(recipe.id);
    recipeRef.update({ comments: recipe.comments })
      .then(() => {
        console.log('Comment added to Firestore successfully.');
      })
      .catch(error => {
        console.error('Error adding comment to Firestore:', error);
      });
  }
  showUserProfile(username: string): void {
    this.router.navigate(['/user', username]);
  }
  rateRecipe(recipe: any, rating: number): void {
    const currentUserId = this.firebaseService.getCurrentUserId();
    if (!currentUserId) {
        console.error("User must be logged in to rate recipes.");
        return;
    }

    // Define the type for ratingsUpdate to allow dynamic keys
    const ratingsUpdate: { [key: string]: any } = {};
    ratingsUpdate[`ratings.${currentUserId}`] = rating; // Construct an object path for updating specific user's rating

    this.firestore.collection('recipes').doc(recipe.id).update(ratingsUpdate)
        .then(() => {
            console.log('Recipe rated successfully.');
            // Ensure recipe.ratings is an object before assigning to avoid runtime errors
            if (!recipe.ratings) recipe.ratings = {};
            recipe.ratings[currentUserId] = rating; // Update the local state to reflect the new rating
        })
        .catch(error => {
            console.error('Error rating recipe:', error);
        });
}

  
calculateAverageRating(recipe: Recipe): number {
  const ratings = recipe.ratings;
  const total = Object.values(ratings).reduce((acc: number, curr: number) => acc + curr, 0);
  const count = Object.keys(ratings).length;
  return count > 0 ? total / count : 0;
}


  openReviewPopup(recipe: any): void {
    const dialogRef = this.dialog.open(ReviewsPopupComponent, {
      width: '500px',
      data: { recipe, reviews: recipe.reviews } // Pass recipe data along with comments
    });
  
    dialogRef.afterClosed().subscribe(newReview => {
      if (newReview) {
        this.addReviewToRecipe(recipe, newReview);
      }
    });
  }
  addReviewToRecipe(recipe: any, newReview: string): void {
    // Update the comments array in the recipe object
    recipe.reviews.push(newReview);
  
    // Update the comments in the Firestore document
    const recipeRef = this.firestore.collection('recipes').doc(recipe.id);
    recipeRef.update({ reviews: recipe.reviews })
      .then(() => {
        console.log('Review added to Firestore successfully.');
      })
      .catch(error => {
        console.error('Error adding review to Firestore:', error);
      });
  }
  
}

