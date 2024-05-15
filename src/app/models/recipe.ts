

export interface Recipe {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    ingredients:string[];
    steps:string[];
    username:string;
    requiredTime:string;
    ratings: { [userId: string]: number };
    nutritionalFacts: NutritionalFacts;
    reviews:string[];
    mealType:string;
    // Add other fields as needed
  }
 
  interface NutritionalFacts {
    calories: number;
    fat: string;
    protein: string;
    carbs: string;
  }