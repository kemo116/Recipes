import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
import { RecipeService } from '../../services/recipe.service';
import { ReviewsPopupComponent } from '../reviews-popup/reviews-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css'
})
export class RecipeDetailComponent {
  recipe$: Observable<any> = new Observable();
  showMenu: boolean = true; // Default to true, meaning menu is visible


  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location,
    private dialog: MatDialog,
    private firestore: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.recipe$ = this.recipeService.getRecipe(id);
      }
    });
  }
  
  goBack(): void {
    this.location.back();
  }
}
