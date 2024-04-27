import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/internal/operators/finalize';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  bgImageUrl!: string;
  recipes: any[] = [];
  filterText = '';
    @Output() isLogout=new EventEmitter<void>()
    constructor(public firebaseService: FirebaseService,private recipeService: RecipeService, private router:Router,private storage: AngularFireStorage){}
    ngOnInit(): void {this.recipeService.getRecipes().subscribe(data => {
      this.recipes = data;
      console.log(this.recipes);
      
    });
    const ref = this.storage.refFromURL('https://firebasestorage.googleapis.com/v0/b/task-c5d3d.appspot.com/o/food-4k-anl1yr892h6ccjeb.jpg?alt=media&token=3c5d2414-b424-46e6-99b8-ef5dd7b29203');
    ref.getDownloadURL().pipe(
      finalize(() => console.log('Image URL fetched successfully'))
    ).subscribe(url => {
      this.bgImageUrl = url;
      console.log(this.bgImageUrl); // For debugging
    });
    }
    onRecipeClick(recipe: any): void {
      console.log('Recipe clicked:', recipe);
      // Here you can route to a detail page or perform other actions
    }
    onSelect(recipe: any): void {
      this.router.navigate(['/recipe', recipe.id]); // Assuming `id` is a unique identifier for each recipe
    }
    logout(){
      this.firebaseService.logout()
      this.isLogout.emit()
    }
}
