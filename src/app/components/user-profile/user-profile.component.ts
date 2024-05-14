import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { RecipeService } from '../../services/recipe.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from '../../services/firebase.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { collection, collectionData } from 'rxfire/firestore';
import { ProfileUser } from '../../models/profile-user';
import { FollowersDialogComponent } from '../followers-dialog/followers-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Recipe } from '../../models/recipe';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user$: Observable<ProfileUser> | undefined;
  filterText = '';
  userRecipes$: Observable<Recipe[]> | undefined;
  referencedRecipes$: Observable<any[]> | undefined;
  showMenu: boolean = true; 
  followers$!: Observable<any[]> ;
  followings$!: Observable<any[]>;
  userId: string | undefined;
  constructor(private userService: UserService,private dialog: MatDialog,private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.firebaseService.currentUser$.subscribe(user => {
      if (user) {
        this.userId = user.uid;
        if (this.userId) {
          this.user$ = this.userService.getUserById(this.userId);
          this.userRecipes$ = this.userService.getUserRecipes(this.userId);
          this.user$?.subscribe(user => {
            if (user && user.postedRecipes) {
              this.referencedRecipes$ = this.userService.getReferencedRecipes(user.postedRecipes);
            }
          });
          this.user$?.subscribe(userData => {
            if (userData) {
              this.followers$ = this.userService.getUserFollowers(userData);
              this.followings$ = this.userService.getUserFollowings(userData);
            }
          });
        }
      }
    });
    
  }
  showFollowers() {
    this.followers$.subscribe(followers => {
      const dialogRef = this.dialog.open(FollowersDialogComponent, {
        width: '400px',
        data: { users: followers, isFollowers: true }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    });
  }
  

  showFollowing() {
    this.followings$.subscribe(followings => {
      const dialogRef = this.dialog.open(FollowersDialogComponent, {
        width: '400px',
        data: { users: followings, isFollowers: false }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    });
  }
  
  
  
  
  
  
}