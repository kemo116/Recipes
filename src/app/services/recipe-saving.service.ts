import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeSavingService {
  constructor(private firestore: AngularFirestore) {}

  saveRecipe(userId: string, recipeId: string): void {
    this.firestore.collection('users').doc(userId).collection('savedRecipes').doc(recipeId).set({ saved: true });
  }

  unsaveRecipe(userId: string, recipeId: string): void {
    this.firestore.collection('users').doc(userId).collection('savedRecipes').doc(recipeId).delete();
  }

  getSavedRecipes(userId: string): Observable<any[]> {
    return this.firestore.collection('users').doc(userId).valueChanges().pipe(
        map((user: any) => user.SavedRecipes || [])
    );
}

}
