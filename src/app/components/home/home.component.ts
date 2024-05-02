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
import { RecipeSavingService } from '../../services/recipe-saving.service';
import firebase from 'firebase/compat';
import { ReviewsPopupComponent } from '../reviews-popup/reviews-popup.component';

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
    private recipeSavingService: RecipeSavingService
    
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
  }
  showDetails(recipe: any): void {
    this.router.navigate(['/recipe', recipe.id]);
  }
  // Function to toggle recipe saved state
  toggleRecipeSavedState(recipe: any): void {
    if (!this.currentUserId) {
        console.error('Current user ID is null.');
        return;
    }

    const userRef = this.firestore.collection('users').doc(this.currentUserId);
    userRef.get().toPromise().then(doc => {
        const savedRecipes = (doc?.data() as { SavedRecipes?: string[] })?.SavedRecipes || [];
        const recipeIndex = savedRecipes.indexOf(`/recipes/${recipe.id}`);

        if (recipeIndex === -1) {
            // Recipe not in saved list, add it
            savedRecipes.push(`/recipes/${recipe.id}`);
        } else {
            // Recipe already in saved list, remove it
            savedRecipes.splice(recipeIndex, 1);
        }

        // Update the user document with the modified saved recipes list
        return userRef.update({ SavedRecipes: savedRecipes });
    }).then(() => {
        console.log('Recipe saved state toggled successfully.');
        recipe.saved = !recipe.saved; // Toggle saved state locally
    }).catch(error => {
        console.error('Error toggling recipe saved state:', error);
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
    const currentRatings = recipe.ratings || []; // Existing ratings or empty array if not rated yet
    const newRatings = [...currentRatings, rating]; // Add the new rating to the existing ratings
    const newRating = newRatings.reduce((sum, rating) => sum + rating, 0) / newRatings.length; // Calculate the average rating
  
    // Update the rating in Firestore
    this.recipeService.updateRecipeRating(recipe.id, newRating)
      .then(() => {
        console.log('Recipe rated successfully.');
        // Optionally, update the local recipe object with the new rating
        recipe.ratings = newRatings;
      })
      .catch(error => {
        console.error('Error rating recipe:', error);
      });
  }
  
  calculateAverageRating(recipe: any): number {
    if (!recipe || recipe.ratings === undefined) {
      return 0; // Return 0 if ratings are undefined
    }
    return recipe.ratings; // Return the overall rating as the average
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
  logout() {
    this.firebaseService.logout()
  }
}

