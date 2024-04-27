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
  async onSignup( email:string,password:string){
    await this.firebaseService.signup(email,password)
    if(this.firebaseService.isLoggedIn)
    this.isSignedIn=true
    
  }
  async onSignin( email:string,password:string){
    await this.firebaseService.signup(email,password)
    if(this.firebaseService.isLoggedIn)
    this.isSignedIn=true
    
  }
  handlelogout(){
    this.isSignedIn=false

  }
}
