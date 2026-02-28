// Condensed comment block.

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe, RecipeDto } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
    // Backend API base URL for recipe endpoints
    private apiUrl = 'http://localhost:5147/api/recipe';

    constructor(private http: HttpClient) { }

    // Comment block removed.
    getAllRecipes(): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(this.apiUrl);
    }

    // Comment block removed.
    getRecipeById(id: number): Observable<Recipe> {
        return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
    }

    // Comment block removed.
    getRecipesByUser(userId: number): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.apiUrl}/user/${userId}`);
    }

    // Helper to map DTO to FormData
    private mapToFormData(dto: RecipeDto | any): FormData {
        const formData = new FormData();
        Object.keys(dto).forEach(key => {
            if (dto[key] !== null && dto[key] !== undefined) {
                formData.append(key, dto[key] instanceof File ? dto[key] : String(dto[key]));
            }
        });
        return formData;
    }

    createRecipe(dto: RecipeDto | any): Observable<Recipe> {
        return this.http.post<Recipe>(this.apiUrl, this.mapToFormData(dto));
    }

    updateRecipe(id: number, dto: RecipeDto | any): Observable<Recipe> {
        return this.http.put<Recipe>(`${this.apiUrl}/${id}`, this.mapToFormData(dto));
    }

    // Comment block removed.
    deleteRecipe(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    // Comment block removed.
    searchByTitle(query: string): Observable<Recipe[]> {
        const params = new HttpParams().set('query', query);
        return this.http.get<Recipe[]>(`${this.apiUrl}/search/title`, { params });
    }

    // Comment block removed.
    searchByIngredients(query: string): Observable<Recipe[]> {
        const params = new HttpParams().set('query', query);
        return this.http.get<Recipe[]>(`${this.apiUrl}/search/ingredients`, { params });
    }

    // Comment block removed.
    searchByCategory(categoryId: number): Observable<Recipe[]> {
        return this.http.get<Recipe[]>(`${this.apiUrl}/search/category/${categoryId}`);
    }

    uploadImage(file: File): Observable<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<{ url: string }>('http://localhost:5147/api/upload', formData);
    }
}
