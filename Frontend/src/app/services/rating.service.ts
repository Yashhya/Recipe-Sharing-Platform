// Condensed comment block.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RatingService {
    private apiUrl = 'http://localhost:5147/api/rating';

    constructor(private http: HttpClient) { }

    // Comment block removed.
    rateRecipe(recipeId: number, ratingValue: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${recipeId}`, { ratingValue });
    }

    // Comment block removed.
    getAverageRating(recipeId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${recipeId}/average`);
    }

    // Comment block removed.
    getUserRating(recipeId: number): Observable<any> {
        return this.http.get(`${this.apiUrl}/${recipeId}/user`);
    }
}
