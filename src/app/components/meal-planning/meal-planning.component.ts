import { Component } from '@angular/core';

@Component({
  selector: 'app-meal-planning',
  templateUrl: './meal-planning.component.html',
  styleUrl: './meal-planning.component.css'
})
export class MealPlanningComponent {
  showMenu: boolean = true;
  days: string[] = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  selectedDay: string | null = null;

  selectDay(day: string) {
    this.selectedDay = day;
  }

  addMeal(mealType: string) {
  if (this.selectedDay) {
    console.log(`Added ${mealType} for ${this.selectedDay}`);
  } else {
    console.log('Please select a day first');
  }
}
}
