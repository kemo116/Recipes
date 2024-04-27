import { Injectable } from '@angular/core';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private firestore: AngularFirestore) { }

  getRecipes(): Observable<any[]> {
    return this.firestore.collection('recipes').valueChanges({ idField: 'id' });
  }
  getRecipe(id: string): Observable<any> {
    return this.firestore.collection('recipes').doc(id).valueChanges();
  }
  
  

}
