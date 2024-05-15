import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap, of, map, filter } from 'rxjs';
import { ProfileUser } from '../models/profile-user';
import { FirebaseService } from './firebase.service';
import { Recipe } from '../models/recipe';
import { AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { docData } from 'rxfire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afs: AngularFirestore,private afAuth: AngularFireAuth ) {}

  getUserById(userId: string): Observable<any> {
    return this.afs.collection('users').doc(userId).valueChanges();
  }
  getUserRecipes(userId: string): Observable<any[]> {
    return this.afs.collection('recipes', ref => ref.where('userId', '==', userId)).valueChanges();
  }
  getRecipesByCommonUsername(username: string): Observable<Recipe[]> {
    return this.afs.collection('recipes', ref => ref.where('username', '==', username)).valueChanges() as Observable<Recipe[]>;
  }
  
  // Function to get recipes referenced by the user
  getReferencedRecipes(recipeIds: string[]): Observable<any[]> {
    // Assuming 'recipes' collection contains recipes
    return this.afs.collection('recipes', ref => ref.where('__name__', 'in', recipeIds)).valueChanges();
  }
  // Function to get user's followers
  getUserFollowers(user: any): Observable<any[]> {
    if (user.followers && user.followers.length > 0) {
      return this.afs.collection('users', ref => ref.where('__name__', 'in', user.followers)).valueChanges();
    } else {
      return new Observable<any[]>(subscriber => subscriber.next([])); // Return empty array if no followers
    }
  }

  // Function to get user's followings
  getUserFollowings(user: any): Observable<any[]> {
    if (user.following && user.following.length > 0) {
      return this.afs.collection('users', ref => ref.where('__name__', 'in', user.following)).valueChanges();
    } else {
      return new Observable<any[]>(subscriber => subscriber.next([])); // Return empty array if no followings
    }
  }
  updateUser(user: ProfileUser): Observable<void> {
    // Update the user document in Firestore
    return new Observable<void>(observer => {
      this.afs.collection('users').doc(user.id).update(user)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
  getUserByUsername(username: string): Observable<ProfileUser | undefined> {
    return this.afs.collection('users', ref => ref.where('username', '==', username))
      .valueChanges({ idField: 'id' })
      .pipe(
        map(users => {
          if (users.length > 0) {
            return users[0] as ProfileUser;
          } else {
            return undefined;
          }
        })
      );
  }
  getFollowerCount(userId: string): Observable<number> {
    return this.afs.collection('users').doc(userId).valueChanges()
      .pipe(
        map((user: any) => user.followers ? user.followers.length : 0)
      );
  }

  getFollowingCount(userId: string): Observable<number> {
    return this.afs.collection('users').doc(userId).valueChanges()
      .pipe(
        map((user: any) => user.following ? user.following.length : 0)
      );
  }
  getCurrentUserUsername(): Observable<string | null> {
    return this.afAuth.authState.pipe(
      map(user => {
        if (user) {
          // User is logged in, return the username
          return user.displayName; // Assuming username is stored in displayName
        } else {
          // User is not logged in
          return null;
        }
      })
    );
  }
  
}