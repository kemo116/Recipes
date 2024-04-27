import { Injectable } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from "@angular/fire/compat/auth";import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  isLoggedIn = false;
  currentUser$: Observable<any>;

  constructor(public firebaseAuth: AngularFireAuth) {
    this.currentUser$ = this.firebaseAuth.authState; // This provides the observable
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
      .then(res => {
        this.isLoggedIn = true;
        localStorage.setItem('user', JSON.stringify(res.user));
      });
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
  }
}
