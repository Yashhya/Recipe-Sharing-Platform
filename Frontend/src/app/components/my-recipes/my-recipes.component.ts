// Condensed comment block.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { Recipe } from '../../models/recipe.model';

@Component({
    selector: 'app-my-recipes',
    standalone: true,
    imports: [
        CommonModule, RouterLink,
        MatCardModule, MatButtonModule, MatIconModule,
        MatProgressSpinnerModule, MatSnackBarModule
    ],
    template: `
    <div class="page-container">
      <div class="page-header">
        <h1><mat-icon>book</mat-icon> My Recipes</h1>
        <p>Manage your published recipes</p>
        <a mat-raised-button routerLink="/add-recipe" class="add-btn">
          <mat-icon>add</mat-icon> New Recipe
        </a>
      </div>

      <div *ngIf="isLoading" class="loading">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div class="recipes-grid" *ngIf="!isLoading">
        <div *ngIf="recipes.length === 0" class="empty-state">
          <mat-icon>restaurant_menu</mat-icon>
          <h2>No recipes yet</h2>
          <p>Start sharing your recipes!</p>
          <a mat-raised-button routerLink="/add-recipe" class="add-btn">Create First Recipe</a>
        </div>

        <mat-card *ngFor="let recipe of recipes" class="recipe-card">
          <div class="card-img-container" (click)="viewRecipe(recipe.recipeId)">
            <img [src]="recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400'"
                 [alt]="recipe.title" class="card-img">
            <div class="badge">{{ recipe.categoryName }}</div>
          </div>
          <mat-card-content class="card-body">
            <h3 (click)="viewRecipe(recipe.recipeId)">{{ recipe.title }}</h3>
            <div class="card-rating">
              <mat-icon *ngFor="let s of [1,2,3,4,5]"
                        [class.filled]="s <= recipe.averageRating" class="star">
                {{ s <= recipe.averageRating ? 'star' : 'star_border' }}
              </mat-icon>
              <span>{{ recipe.averageRating | number:'1.1-1' }}</span>
            </div>
            <div class="card-actions">
              <button mat-button class="edit-btn" [routerLink]="['/edit-recipe', recipe.recipeId]">
                <mat-icon>edit</mat-icon> Edit
              </button>
              <button mat-button class="del-btn" (click)="deleteRecipe(recipe)">
                <mat-icon>delete</mat-icon> Delete
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
    styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; padding: 32px 24px; }
    .page-header { text-align: center; margin-bottom: 32px; }
    .page-header h1 {
      color: white; font-size: 32px; display: flex; align-items: center;
      justify-content: center; gap: 8px; margin: 0 0 8px 0;
    }
    .page-header h1 mat-icon { color: #e94560; }
    .page-header p { color: rgba(255,255,255,0.6); margin: 0 0 20px 0; }
    .add-btn {
      background: linear-gradient(135deg, #e94560, #ff6b6b) !important;
      color: white !important;
    }
    .loading { display: flex; justify-content: center; padding: 40px; }
    .recipes-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    .empty-state {
      grid-column: 1/-1; text-align: center; padding: 60px 20px;
      color: rgba(255,255,255,0.5);
    }
    .empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; }
    .empty-state h2 { color: white; }
    .recipe-card {
      border-radius: 16px !important;
      background: rgba(255,255,255,0.05) !important;
      border: 1px solid rgba(255,255,255,0.08);
      overflow: hidden;
      transition: all 0.3s;
    }
    .recipe-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.4); }
    .card-img-container { position: relative; height: 180px; cursor: pointer; overflow: hidden; }
    .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .card-img-container:hover .card-img { transform: scale(1.05); }
    .badge {
      position: absolute; top: 10px; right: 10px;
      background: rgba(233,69,96,0.9); color: white;
      padding: 4px 12px; border-radius: 20px; font-size: 12px;
    }
    .card-body { padding: 16px !important; }
    .card-body h3 {
      color: white; font-size: 17px; margin: 0 0 8px 0; cursor: pointer;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .card-body h3:hover { color: #e94560; }
    .card-rating { display: flex; align-items: center; gap: 2px; margin-bottom: 12px; }
    .star { font-size: 16px !important; width: 16px !important; height: 16px !important; color: #555; }
    .star.filled { color: #ffc107 !important; }
    .card-rating span { color: rgba(255,255,255,0.6); font-size: 13px; margin-left: 4px; }
    .card-actions { display: flex; gap: 8px; }
    .edit-btn { color: #64b5f6 !important; }
    .del-btn { color: #ef5350 !important; }
  `]
})
export class MyRecipesComponent implements OnInit {
    recipes: Recipe[] = [];
    isLoading = true;

    constructor(
        private recipeService: RecipeService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadMyRecipes();
    }

    loadMyRecipes(): void {
        const userId = this.authService.getUserId();
        this.recipeService.getRecipesByUser(userId).subscribe({
            next: (r) => { this.recipes = r; this.isLoading = false; },
            error: () => this.isLoading = false
        });
    }

    viewRecipe(id: number): void {
        this.router.navigate(['/recipe', id]);
    }

    deleteRecipe(recipe: Recipe): void {
        if (confirm(`Delete "${recipe.title}"?`)) {
            this.recipeService.deleteRecipe(recipe.recipeId).subscribe({
                next: () => {
                    this.recipes = this.recipes.filter(r => r.recipeId !== recipe.recipeId);
                    this.snackBar.open('Recipe deleted', 'Close', { duration: 2000 });
                }
            });
        }
    }
}
