import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';
interface MealEntry {
  userId: string;
  title: string;
}
interface MealEntries {
  [key: string]: any[]; // This allows any property names with values as arrays
}

interface MealData {
  [mealType: string]: MealEntry[];
}
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
  addMealToDay(day: string, mealType: string, recipe: Recipe): Promise<void> {
    if (!this.currentUserId) {
        return Promise.reject('No user logged in');
    }

    const dayRef = this.firestore.collection('mealPlan').doc(day);
    
    return dayRef.get().toPromise().then(doc => {
        const data = doc!.exists ? (doc!.data() as { [key: string]: any[] }) : {};
        let mealEntries: any[] = Array.isArray(data[mealType]) ? data[mealType] : [];

        let entry = {
            userId: this.currentUserId,
            title: recipe.title // Assuming recipe.title is defined
        };

        // Check if an entry for this user already exists
        const index = mealEntries.findIndex(meal => meal.userId === this.currentUserId);
        if (index !== -1) {
            mealEntries[index] = entry; // Update existing entry
        } else {
            mealEntries.push(entry); // Add new entry
        }

        // Define updateObject using the MealEntries type
        let updateObject: MealEntries = {};
        updateObject[mealType] = mealEntries;

        if (doc!.exists) {
            return dayRef.update(updateObject);
        } else {
            return dayRef.set(updateObject);
        }
    }).catch(error => {
        console.error('Failed to update meal data:', error);
        throw error;
    });
}


  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }
}
