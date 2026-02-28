import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe.model';

export interface UserAdmin {
    userId: number;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
    private apiUrl = 'http://localhost:5147/api/admin';

    constructor(private http: HttpClient) { }

    getAllUsers(): Observable<UserAdmin[]> {
        return this.http.get<UserAdmin[]>(`${this.apiUrl}/users`);
    }

    deleteUser(userId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/user/${userId}`);
    }

    getAllRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.apiUrl}/recipes`);
    }

    deleteRecipe(recipeId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/recipe/${recipeId}`);
    }

    getAnalytics(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/analytics`);
    }
}
