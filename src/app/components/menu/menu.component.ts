import { Component, ViewChild } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  @ViewChild('menuButton') menuButton!: any;
  menuOpen: boolean = false;
  constructor(private firebaseService:FirebaseService, private router: Router){}
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
  logout() {
    this.firebaseService.logout();

    const isLoggedIn = this.firebaseService.isLoggedIn;
    if (!isLoggedIn) {
      this.router.navigateByUrl('/'); // Navigate to the signup component only if not logged in
    }
    window.location.reload();
  }
}
