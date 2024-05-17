import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProfileUser } from '../../models/profile-user';
import { FirebaseService } from '../../services/firebase.service';
import { Recipe } from '../../models/recipe';
import { Observable, forkJoin, switchMap, take } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { MatDialog } from '@angular/material/dialog';
import { FollowersDialogComponent } from '../followers-dialog/followers-dialog.component';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  user: ProfileUser | undefined;
  postedRecipes: Recipe[] = [];
  followerCount: number = 0;
  followers$!: Observable<any[]> ;
  followings$!: Observable<any[]>;
  followingCount: number = 0;
  showMenu: boolean = true;
  
  constructor(private dialog: MatDialog,private router:Router,private route: ActivatedRoute, private userService: UserService, private firebaseService: FirebaseService, private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const username = params['username'];
      this.userService.getUserByUsername(username).subscribe(user => {
        this.user = user;
        if (user) {
          this.updateFollowerAndFollowingCounts(user.id);
          // Call method to fetch recipes by username
          this.getRecipesByCommonUsername(username);
        }
      });
    });
  }
  
  updateFollowerAndFollowingCounts(userId: string): void {
    this.userService.getFollowerCount(userId).subscribe(count => {
      this.followerCount = count;
    });

    this.userService.getFollowingCount(userId).subscribe(count => {
      this.followingCount = count;
    });
  }

  // Change parameter to recipeIds: string[]
  getRecipesByCommonUsername(username: string): void {
    this.recipeService.getRecipesByCommonUsername(username).subscribe(recipes => {
      this.postedRecipes = recipes;
    });
  }

  isFollowing(user: ProfileUser): boolean {
    const currentUserId = this.firebaseService.getCurrentUserId();
    return user.followers!.includes(currentUserId!);
}


  toggleFollowUser(profileUser: ProfileUser): void {
    const currentUserId = this.firebaseService.getCurrentUserId();
    if (!currentUserId) {
      console.error('User not logged in.');
      return;
    }

    this.userService.getUserById(currentUserId)
      .pipe(
        take(1),  // Take only the first emission
        switchMap(currentUser => {
          const isFollowing = this.isFollowing(profileUser);
          if (isFollowing) {
            profileUser.followers = profileUser.followers!.filter(id => id !== currentUserId);
            currentUser.following = currentUser.following.filter((id: any) => id !== profileUser.id);
          } else {
            profileUser.followers = (profileUser.followers || []).concat([currentUserId]);
            currentUser.following = (currentUser.following || []).concat([profileUser.id]);
          }

          return forkJoin({
            profileUpdate: this.userService.updateUser(profileUser),
            currentUserUpdate: this.userService.updateUser(currentUser)
          });
        })
      ).subscribe({
        next: result => {
          console.log('Users updated successfully', result);
        },
        error: err => {
          console.error('Error updating users', err);
        }
      });
}
showDetails(recipe: any): void {
  if (!recipe.title) {
      console.error("No title found for the recipe:", recipe);
      return;
  }

  
  this.recipeService.getRecipeByTitle(recipe.title).subscribe(
      (foundRecipes) => {
          if (foundRecipes.length > 0) {
              const foundRecipe = foundRecipes[0]; 
              this.router.navigate(['/recipe', foundRecipe.id]);
          } else {
              console.error("No recipe found with title:", recipe.title);
          }
      },
      (error) => {
          console.error("Error fetching recipe by title:", error);
      }
  );
}
showFollowers(): void {
  if (!this.user || !this.user.id) {
    console.error('User is not loaded yet.');
    return;
  }

  this.userService.getUserFollowers(this.user.id).subscribe(followers => {
    const dialogRef = this.dialog.open(FollowersDialogComponent, {
      width: '400px',
      data: { users: followers, isFollowers: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  });
}

showFollowing(): void {
  if (!this.user || !this.user.id) {
    console.error('User is not loaded yet.');
    return;
  }

  this.userService.getUserFollowings(this.user.id).subscribe(followings => {
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
