import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AngularFireModule} from '@angular/fire/compat'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FirebaseService } from './services/firebase.service';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { LoginComponent } from './components/login/login.component';
import { FilterPipe } from './pipe/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserProfileComponent } from './components/user-profile/user-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignupComponent,
    RecipeDetailComponent,
    LoginComponent,
    FilterPipe,
    UserProfileComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule ,
    ReactiveFormsModule ,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBIWbgJ3laZUwpSWrrnGcRs5squ4aaZ7gI",
      authDomain: "task-c5d3d.firebaseapp.com",
      projectId: "task-c5d3d",
      storageBucket: "task-c5d3d.appspot.com",
      messagingSenderId: "841408636463",
      appId: "1:841408636463:web:da0339288c0e33f97c48da"
    }),
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
