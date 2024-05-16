import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  isSignedIn=false;
  errorMessage: string = ''; 

  constructor(public firebaseService:FirebaseService,public router: Router){}
  navigateToLogin() {
    console.log("Navigating to login");
    this.router.navigateByUrl('/login');
  }
  
  ngOnInit(): void {
    if(localStorage.getItem('user')!==null)
    this.isSignedIn=true
    else
    this.isSignedIn=false
    

  }
  async onSignup(email: string, password: string) {
    
    if (!email || !password) {
      this.errorMessage = 'Please enter both email and password.';
      return; 
    }

    try {
      await this.firebaseService.signup(email, password);
      if (this.firebaseService.isLoggedIn)
        this.isSignedIn = true;
    } catch (error) {
      console.error('Error signing up:', error);
      this.errorMessage = 'Failed to sign up. Please try again later.';
    }
  }
  async onSignin( email:string,password:string){
    await this.firebaseService.signup(email,password)
    if(this.firebaseService.isLoggedIn)
    this.isSignedIn=true
    
  }
  handlelogout() {
   this.isSignedIn = false;
  }
  
}
