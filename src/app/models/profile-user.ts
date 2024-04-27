export interface ProfileUser {
    uid: string;
    email?: string;
    username?:string;
    displayName?: string;
    photoURL?: string;
    followerIds?: string[];
    followingIds?: string[];
    recipes?:string[];
}