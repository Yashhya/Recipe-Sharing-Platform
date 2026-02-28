// Condensed comment block.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CommentDto } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class CommentService {
    private apiUrl = 'http://localhost:5147/api/comment';

    constructor(private http: HttpClient) { }

    // Comment block removed.
    getCommentsByRecipe(recipeId: number): Observable<Comment[]> {
        return this.http.get<Comment[]>(`${this.apiUrl}/${recipeId}`);
    }

    // Comment block removed.
    addComment(recipeId: number, dto: CommentDto): Observable<Comment> {
        return this.http.post<Comment>(`${this.apiUrl}/${recipeId}`, dto);
    }
}
