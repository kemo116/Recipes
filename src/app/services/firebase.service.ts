import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false;
  currentUser$: Observable<any>;
  currentUserId: string | null = null; // Add a property to store the current user ID

  constructor(public firebaseAuth: AngularFireAuth, private firestore: AngularFirestore) {
    this.currentUser$ = this.firebaseAuth.authState;
    this.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.uid; // Extract and store the current user ID
      } else {
        this.currentUserId = null; // Reset the current user ID if user is not logged in
      }
    });
  }

  getCurrentUserId(): string | null {
    return this.currentUserId;
  }

  getUserById(userId: string): Observable<any> {
    return this.firestore.collection('users').doc(userId).valueChanges();
  }

  async signin(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password)
      .then(res => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      });
  }

  async signup(email: string, password: string) {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
      .then(async (res) => {
        if (res && res.user) {
          this.isLoggedIn = true;
          localStorage.setItem('user', JSON.stringify(res.user));
  
          // Extract username from email
          const username = email.split('@')[0];
  
          // Create the user document
          await this.firestore.collection('users').doc(res.user.uid).set({
            email: email,
            username: username,
            followers: 0,
            followings: 0,
            postedRecipes: [],
            savedRecipes: []
          });
        }
      })
      .catch(error => {
        // Handle error here, if needed
        console.error("Error signing up:", error);
      });
  }
  getUserData(userId: string): Promise<any> {
    return this.firestore.collection('users').doc(userId).get().toPromise().then(doc => doc!.data());
  }
  
  // Method to update a user's saved recipes
  updateUserSavedRecipes(userId: string, recipes: any[]): Promise<void> {
    const userRef = this.firestore.collection('users').doc(userId);
    return userRef.update({
      savedRecipes: recipes
    });
  }
  updateUserMealPlan(userId: string, day: string, mealType: string, recipe: any): Promise<void> {
    const userRef = this.firestore.collection('users').doc(userId);
    return userRef.set({
      [`mealPlan.${day}.${mealType}`]: {
        recipeId: recipe.id,
        title: recipe.title
      }
    }, { merge: true });
  }
  
  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }
}
