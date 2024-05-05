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

    reviews:string[];
    mealType:string;
    // Add other fields as needed
  }
  