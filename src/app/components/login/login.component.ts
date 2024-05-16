import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isSignedIn=false;
  errorMessage: string = '';
  constructor(public firebaseService:FirebaseService,public router: Router){}
  navigateToSignUp() {
    console.log("Navigating to SignUp");
    this.router.navigateByUrl('');
  }
  
  ngOnInit(): void {
    if(localStorage.getItem('user')!==null)
    this.isSignedIn=true
    else
    this.isSignedIn=false
    

  }
 
  async onSignin(email: string, password: string) {
    // Client-side validation
    if (!email || !password) {
      this.errorMessage = 'Please enter both email and password.';
      return; // Prevent further execution if fields are empty
    }

    try {
      await this.firebaseService.signin(email, password);
      if (this.firebaseService.isLoggedIn)
        this.isSignedIn = true;
    } catch (error) {
      console.error('Error signing in:', error);
      this.errorMessage = 'Failed to sign in. Please check your credentials and try again.';
    }
  }
  handlelogout(){
    this.isSignedIn=false

  }
}
