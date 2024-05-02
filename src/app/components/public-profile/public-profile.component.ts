import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ProfileUser } from '../../models/profile-user';
import { FirebaseService } from '../../services/firebase.service';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'app-public-profile',
  templateUrl: './public-profile.component.html',
  styleUrls: ['./public-profile.component.css']
})
export class PublicProfileComponent implements OnInit {
  user: ProfileUser | undefined;
  postedRecipes: Recipe[] = [];
  followerCount: number = 0;
  followingCount: number = 0;

  constructor(private route: ActivatedRoute, private userService: UserService, private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const username = params['username'];
      this.userService.getUserByUsername(username).subscribe(user => {
        this.user = user;
        if (user) {
          this.updateFollowerAndFollowingCounts(user.id);
          this.getUserRecipes(user.postedRecipes ?? []);// Pass postedRecipes instead of id
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
  getUserRecipes(recipeIds: string[]): void {
    this.userService.getReferencedRecipes(recipeIds).subscribe(recipes => { // Use getReferencedRecipes instead of getUserRecipes
      this.postedRecipes = recipes;
    });
  }

  isFollowing(user: ProfileUser): boolean {
    const userId = this.firebaseService.getCurrentUserId();
    return !!userId && !!user.followers && user.followers.includes(userId);
  }

  toggleFollowUser(user: ProfileUser): void {
    const userId = this.firebaseService.getCurrentUserId();
    if (!userId) {
      console.error('User not logged in.');
      return;
    }

    if (this.isFollowing(user)) {
      // Unfollow user
      // Remove user from current user's followings list
      const index = user.followers?.indexOf(userId);
      if (index !== undefined && index !== -1) {
        user.followers?.splice(index, 1);
      }
    } else {
      // Follow user
      // Add user to current user's followings list
      if (!user.followers) {
        user.followers = [];
      }
      user.followers.push(userId);
     
    }

    // Update user document in Firestore
    this.userService.updateUser(user).subscribe(() => {
      console.log('User follow state updated successfully.');
    });
  }
}
