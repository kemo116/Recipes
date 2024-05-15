import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { CommentPopupComponent } from '../comment-popup/comment-popup.component';
import { ReviewsPopupComponent } from '../reviews-popup/reviews-popup.component';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  bgImageUrl!: string;
  recipes: any[] = [];
  filterText = '';
  newComment: string = '';
  showMenu: boolean = true;
  currentUserId: string | null = null;

  constructor(
    public firebaseService: FirebaseService,
    private recipeService: RecipeService,
    private router: Router,
    private storage: AngularFireStorage,
    private dialog: MatDialog,
    private firestore: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.loadRecipes();
    this.loadBackgroundImage();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe(allRecipes => {
      this.currentUserId = this.firebaseService.getCurrentUserId();
      if (this.currentUserId) {
        this.firebaseService.getUserData(this.currentUserId).then(user => {
          const savedRecipesTitles = user && user.savedRecipes ? user.savedRecipes.map((r: { title: any; }) => r.title) : [];
          this.recipes = allRecipes.map(recipe => {
            recipe.saved = savedRecipesTitles.includes(recipe.title);
            return recipe;
          });
        }).catch(error => {
          console.error('Error fetching user data:', error);
        });
      } else {
        this.recipes = allRecipes;
      }
    });
  }

  loadBackgroundImage(): void {
    const ref = this.storage.refFromURL('https://firebasestorage.googleapis.com/v0/b/task-c5d3d.appspot.com/o/food-4k-anl1yr892h6ccjeb.jpg?alt=media&token=3c5d2414-b424-46e6-99b8-ef5dd7b29203');
    ref.getDownloadURL().pipe(
      finalize(() => console.log('Image URL fetched successfully'))
    ).subscribe(url => {
      this.bgImageUrl = url;
    });
  }

  showDetails(recipe: any): void {
    this.router.navigate(['/recipe', recipe.id]);
  }

  toggleRecipeSavedState(recipe: any): void {
    if (!this.currentUserId) {
      console.error("User must be logged in to toggle saved recipes.");
      return;
    }

    const newState = !recipe.saved;

    this.firebaseService.getUserData(this.currentUserId).then(user => {
      let savedRecipes = user.savedRecipes || [];
      if (newState) {
        savedRecipes.push({
          id: recipe.id,
          title: recipe.title,
          description: recipe.description,
          rating: recipe.ratings,
          imageUrl: recipe.imageUrl
        });
      } else {
        savedRecipes = savedRecipes.filter((r: { id: any; }) => r.id !== recipe.id);
      }

      this.firebaseService.updateUserSavedRecipes(this.currentUserId!, savedRecipes).then(() => {
        recipe.saved = newState;
        console.log('Saved recipes updated successfully.');
      }).catch(error => {
        console.error('Error updating saved recipes:', error);
      });
    }).catch(error => {
      console.error('Error fetching user data:', error);
    });
  }
  liked: boolean = true;
  likeRecipe(recipe: any): void {
   if(this.liked ==true){
    const recipeRef = this.firestore.collection('recipes').doc(recipe.id);
    recipeRef.update({ likes: recipe.likes + 1 });
    this.liked=false;
   }else{
    const recipeRef = this.firestore.collection('recipes').doc(recipe.id);
    recipeRef.update({ likes: recipe.likes -1 });
    this.liked=true;
   }
   
  }

  openCommentPopup(recipe: any): void {
    const dialogRef = this.dialog.open(CommentPopupComponent, {
      width: '500px',
      data: { recipe, comments: recipe.comments }
    });

    dialogRef.afterClosed().subscribe(newComment => {
      if (newComment) {
        this.addCommentToRecipe(recipe, newComment);
      }
    });
  }

  addCommentToRecipe(recipe: any, newComment: string): void {
    recipe.comments.push(newComment);
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
    this.firebaseService.getCurrentUsername().subscribe(currentUsername => {
      if (currentUsername === username) {
        this.router.navigate(['/profile']);
      } else {
        this.router.navigate(['/user', username]);
      }
    });
  }
  

  rateRecipe(recipe: any, rating: number): void {
    const currentUserId = this.firebaseService.getCurrentUserId();
    if (!currentUserId) {
      console.error("User must be logged in to rate recipes.");
      return;
    }

    const ratingsUpdate: { [key: string]: any } = {};
    ratingsUpdate[`ratings.${currentUserId}`] = rating;

    this.firestore.collection('recipes').doc(recipe.id).update(ratingsUpdate)
      .then(() => {
        console.log('Recipe rated successfully.');
        if (!recipe.ratings) recipe.ratings = {};
        recipe.ratings[currentUserId] = rating;
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
      data: { recipe, reviews: recipe.reviews }
    });

    dialogRef.afterClosed().subscribe(newReview => {
      if (newReview) {
        this.addReviewToRecipe(recipe, newReview);
      }
    });
  }

  addReviewToRecipe(recipe: any, newReview: string): void {
    recipe.reviews.push(newReview);
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
