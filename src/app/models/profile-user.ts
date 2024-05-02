export interface ProfileUser {
    id: string;
    email?: string;
    username?:string;
    followers?: string[];
    following?: string[];
    postedRecipes?:string[];
    profilePicture?:string;
    bio?:string;
    SavedRecipes:string[];

}