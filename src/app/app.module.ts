import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { LoginComponent } from './components/login/login.component';
import { FilterPipe } from './pipe/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { MaterialModule } from './Material.Module';
import { MenuComponent } from './components/menu/menu.component';
import { PostRecipeComponent } from './components/post-recipe/post-recipe.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { CommentPopupComponent } from './components/comment-popup/comment-popup.component';
import { HttpClientModule } from '@angular/common/http';
import {provideFirestore,getFirestore} from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from './environment';
import { initializeApp } from '@angular/fire/app/firebase';
import { FollowersDialogComponent } from './components/followers-dialog/followers-dialog.component';
import { SavedRecipesComponent } from './components/saved-recipes/saved-recipes.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { ReviewsPopupComponent } from './components/reviews-popup/reviews-popup.component';
import { MealPlanningComponent } from './components/meal-planning/meal-planning.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { CapitalizePipe } from './pipe/capitalize.pipe';
import { FooterComponent } from './components/footer/footer.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    RecipeDetailComponent,
    LoginComponent,
    FilterPipe,
    UserProfileComponent,
    MenuComponent,
    PostRecipeComponent,
    CommentPopupComponent,
    FollowersDialogComponent,
    SavedRecipesComponent,
    PublicProfileComponent,
    ReviewsPopupComponent,
    MealPlanningComponent,
    CapitalizePipe,
    FooterComponent,
    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Initialize Firebase
    AngularFireAuthModule, // Import AngularFireAuthModule
    AngularFirestoreModule,
    MatListModule  ,
    // provideFirestore(() => initializeApp(environment.firebaseConfig)).ngModule,
    provideFirestore(() => getFirestore())
  ],
  providers: [
    provideAnimationsAsync()
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }


