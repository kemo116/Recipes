import { Component, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { addDoc, collection } from 'firebase/firestore';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-post-recipe',
  templateUrl: './post-recipe.component.html',
  styleUrls: ['./post-recipe.component.css']
})
export class PostRecipeComponent {
  @ViewChild('createPostRecipeform') recipeForm: any;
  showMenu: boolean = true;

  constructor(private firestore: AngularFirestore, private firebaseService: FirebaseService) { }

  saveData() {
    const acollection = collection(this.firestore.firestore, 'recipes');
    const recipeIngredients = this.recipeForm.value.ingredients.split('\n').map((ingredient: string) => ingredient.trim());
    const recipeSteps = this.recipeForm.value.steps.split('\n').map((step: string) => step.trim());

    this.firebaseService.currentUser$.subscribe(currentUser => {
      if (currentUser) {
        const username = currentUser.email.split('@')[0];

        addDoc(acollection, {
          'title': this.recipeForm.value.title,
          'cuisine': this.recipeForm.value.cuisine,
          'requiredTime': this.recipeForm.value.requiredTime,
          'category':this.recipeForm.value.category,
          'description': this.recipeForm.value.description,
          'imageUrl': this.recipeForm.value.imageUrl,
          'steps': recipeSteps,
          'ingredients': recipeIngredients,
          'likes': 0,
          'comments': [],
          'rating': 0,
          'reviews': [],
          'username': username,
          'isFollowed': false,
        })
          .then(() => {
            console.log('Recipe posted successfully');
            this.resetForm();
          })
          .catch(error => {
            console.error('Error posting recipe:', error);
          });
      } else {
        console.error('Current user not found');
      }
    });
  }

  resetForm(): void {
    this.recipeForm.reset();
  }

  postRecipe(): void {
    this.saveData();
  }
}
