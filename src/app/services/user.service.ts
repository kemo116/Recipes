import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, switchMap, of } from 'rxjs';
import { ProfileUser } from '../models/profile-user';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // get CurrentUserProfile$():Observable<ProfileUser | null>{
  //   return this.authservice.currentUser$.pipe(
  //     switchMap(user =>{
  //       if(!user?.uid){
  //         return of(null);
  //       }
  //       //const ref=doc(this.firestore,'users', user?.uid)
  //       //return docData(ref) as Observable<ProfileUser>
  //     })
  //   )
  // }
  constructor(public firestore: AngularFirestore,public authservice:FirebaseService){}
}
