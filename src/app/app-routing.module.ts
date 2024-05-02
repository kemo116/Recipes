import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { LoginComponent } from './components/login/login.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { PostRecipeComponent } from './components/post-recipe/post-recipe.component';
import { SavedRecipesComponent } from './components/saved-recipes/saved-recipes.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';

const routes: Routes = [
  {path:'', component:  SignupComponent},
  {path:'home',component:HomeComponent},
  { path: 'recipe/:id', component: RecipeDetailComponent },
  {path: 'login',component: LoginComponent},
  { path: 'post', component: PostRecipeComponent },
  {path: 'saved',component:SavedRecipesComponent},
  { path: 'profile', component: UserProfileComponent },
  { path: 'user/:username', component:PublicProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
