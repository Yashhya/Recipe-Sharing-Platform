// Condensed comment block.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    private apiUrl = 'http://localhost:5147/api/category';

    constructor(private http: HttpClient) { }

    // Comment block removed.
    getAllCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }
}
