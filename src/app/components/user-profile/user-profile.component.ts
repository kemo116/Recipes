import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UserService } from '../../services/user.service';
import { RecipeService } from '../../services/recipe.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseService } from '../../services/firebase.service';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit{
uploadFile() {

}
saveProfile() {
}

  user$=this.authService.currentUser$;
  constructor(public authService:FirebaseService){}
  ngOnInit(): void {
    
  }
  profileForm=new FormGroup({
    uid:new FormControl(''),
    email: new FormControl(''),
    username:new FormControl(''),
    displayName: new FormControl(''),
    photoURL: new FormControl(''),
    followerIds: new FormControl(''),
    followingIds: new FormControl(''),
    recipes:new FormControl(''),

  });
  
}
