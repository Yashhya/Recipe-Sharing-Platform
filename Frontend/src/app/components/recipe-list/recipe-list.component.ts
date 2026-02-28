// Condensed comment block.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RecipeService } from '../../services/recipe.service';
import { CategoryService } from '../../services/category.service';
import { Recipe, Category } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatChipsModule, MatProgressSpinnerModule
  ],
  template: `
    <!-- Hero section with search -->
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Discover Delicious Recipes</h1>
        <p class="hero-subtitle">Explore thousands of recipes from our community of food lovers</p>

        <!-- Search bar -->
        <div class="search-container">
          <div class="search-bar">
            <mat-icon class="search-icon">search</mat-icon>
            <input type="text" placeholder="Search recipes by title or ingredients..."
                   [(ngModel)]="searchQuery"
                   (keyup.enter)="onSearch()">
            <button mat-icon-button (click)="onSearch()" class="search-btn">
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>

          <!-- Search type toggle -->
          <div class="search-options">
            <mat-chip-set>
              <mat-chip [class.active-chip]="searchType === 'title'" (click)="searchType = 'title'">
                By Title
              </mat-chip>
              <mat-chip [class.active-chip]="searchType === 'ingredients'" (click)="searchType = 'ingredients'">
                By Ingredients
              </mat-chip>
            </mat-chip-set>
          </div>
        </div>
      </div>
    </div>

    <!-- Category filter bar -->
    <div class="category-filter">
      <div class="filter-content">
        <button mat-button [class.active-filter]="selectedCategory === 0"
                (click)="filterByCategory(0)" class="filter-chip">
          <mat-icon>restaurant</mat-icon> All
        </button>
        <button mat-button *ngFor="let cat of categories"
                [class.active-filter]="selectedCategory === cat.categoryId"
                (click)="filterByCategory(cat.categoryId)" class="filter-chip">
          {{ cat.categoryName }}
        </button>
      </div>
    </div>

    <!-- Loading spinner -->
    <div *ngIf="isLoading" class="loading-container">
      <mat-spinner diameter="40"></mat-spinner>
      <p>Loading recipes...</p>
    </div>

    <!-- Recipe grid -->
    <div class="recipe-grid" *ngIf="!isLoading">
      <div *ngIf="recipes.length === 0" class="no-results">
        <mat-icon>search_off</mat-icon>
        <h2>No recipes found</h2>
        <p>Try a different search or browse all recipes</p>
        <button mat-raised-button (click)="loadAllRecipes()" class="reset-btn">Show All Recipes</button>
      </div>

      <mat-card *ngFor="let recipe of recipes" class="recipe-card" (click)="viewRecipe(recipe.recipeId)">
        <!-- Recipe image with fallback -->
        <div class="card-image-container">
          <img [src]="recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400'"
               [alt]="recipe.title" class="card-image"
               (error)="onImageError($event)">
          <div class="card-category-badge">{{ recipe.categoryName }}</div>
        </div>

        <mat-card-content class="card-body">
          <h3 class="card-title">{{ recipe.title }}</h3>

          <!-- Star rating display -->
          <div class="card-rating">
            <mat-icon *ngFor="let star of [1,2,3,4,5]"
                      [class.filled-star]="star <= recipe.averageRating"
                      class="star-icon">
              {{ star <= recipe.averageRating ? 'star' : 'star_border' }}
            </mat-icon>
            <span class="rating-text">{{ recipe.averageRating | number:'1.1-1' }}</span>
          </div>

          <div class="card-meta">
            <span class="meta-item">
              <mat-icon>person</mat-icon>
              {{ recipe.authorName }}
            </span>
            <span class="meta-item" *ngIf="recipe.cookingTime">
              <mat-icon>schedule</mat-icon>
              {{ recipe.cookingTime }} min
            </span>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .hero-section {
      background: var(--bg-hero);
      padding: 60px 24px 40px;
      text-align: center;
    }
    .hero-content {
      max-width: 700px;
      margin: 0 auto;
    }
    .hero-title {
      color: #2b2b2b;
      font-size: 42px;
      font-weight: 800;
      line-height: 1.3;
      padding-bottom: 10px;
      margin: 0 0 12px 0;
      background: var(--text-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      color: var(--text-muted);
      font-size: 18px;
      margin: 0 0 32px 0;
    }
    .search-container {
      max-width: 600px;
      margin: 0 auto;
    }
    .search-bar {
      display: flex;
      align-items: center;
      background: var(--bg-input);
      border: 1px solid var(--border-medium);
      border-radius: 16px;
      padding: 4px 8px 4px 16px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .search-bar:focus-within {
      border-color: #e94560;
      box-shadow: 0 0 20px rgba(233, 69, 96, 0.2);
    }
    .search-icon {
      color: var(--text-muted);
      margin-right: 8px;
    }
    .search-bar input {
      flex: 1;
      border: none;
      background: none;
      color: var(--text-main);
      font-size: 16px;
      outline: none;
      padding: 12px 0;
    }
    .search-bar input::placeholder {
      color: var(--text-faint);
    }
    .search-btn {
      color: #e94560 !important;
    }
    .search-options {
      margin-top: 12px;
    }
    .active-chip {
      background: #e94560 !important;
      color: white !important;
    }
    .category-filter {
      background: var(--bg-filter);
      padding: 16px 24px;
      overflow-x: auto;
      border-bottom: 1px solid var(--border-light);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }
    .filter-content {
      display: flex;
      gap: 8px;
      max-width: 1200px;
      margin: 0 auto;
      flex-wrap: wrap;
      justify-content: center;
    }
    .filter-chip {
      color: var(--text-muted) !important;
      border: 1px solid var(--border-medium);
      border-radius: 30px !important;
      font-size: 13px;
      transition: all 0.3s ease;
    }
    .filter-chip:hover, .active-filter {
      color: white !important;
      background: #e94560 !important;
      border-color: #e94560 !important;
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
      color: var(--text-muted);
      gap: 16px;
    }
    .recipe-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
      padding: 32px 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px 20px;
      color: var(--text-muted);
    }
    .no-results mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
    }
    .no-results h2 { color: var(--text-main); }
    .reset-btn {
      background: #e94560 !important;
      color: white !important;
      margin-top: 16px;
    }
    .recipe-card {
      border-radius: 16px !important;
      overflow: hidden;
      background: var(--bg-card) !important;
      border: 1px solid var(--border-medium);
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    .recipe-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 16px 30px rgba(0, 0, 0, 0.1);
      border-color: rgba(233, 69, 96, 0.3);
    }
    .card-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }
    .card-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .recipe-card:hover .card-image {
      transform: scale(1.05);
    }
    .card-category-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(233, 69, 96, 0.9);
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }
    .card-body {
      padding: 16px !important;
    }
    .card-title {
      color: var(--text-main);
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px 0;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-rating {
      display: flex;
      align-items: center;
      gap: 2px;
      margin-bottom: 12px;
    }
    .star-icon {
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      color: var(--star-empty);
    }
    .filled-star {
      color: #ffc107 !important;
    }
    .rating-text {
      color: var(--text-secondary);
      font-size: 14px;
      margin-left: 4px;
    }
    .card-meta {
      display: flex;
      gap: 16px;
      color: var(--text-muted);
      font-size: 13px;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .meta-item mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  categories: Category[] = [];
  searchQuery = '';
  searchType: 'title' | 'ingredients' = 'title';
  selectedCategory = 0;
  isLoading = true;

  constructor(
    private recipeService: RecipeService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  // Comment block removed.
  ngOnInit(): void {
    this.loadAllRecipes();
    this.loadCategories();
  }

  // Comment block removed.
  loadAllRecipes(): void {
    this.isLoading = true;
    this.selectedCategory = 0;
    this.searchQuery = '';
    this.recipeService.getAllRecipes().subscribe({
      next: (recipes) => {
        setTimeout(() => {
          this.recipes = recipes;
          this.isLoading = false;
        });
      },
      error: () => {
        setTimeout(() => this.isLoading = false);
      }
    });
  }

  // Comment block removed.
  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => setTimeout(() => this.categories = categories)
    });
  }

  // Comment block removed.
  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.loadAllRecipes();
      return;
    }
    this.isLoading = true;
    const searchObservable = this.searchType === 'title'
      ? this.recipeService.searchByTitle(this.searchQuery)
      : this.recipeService.searchByIngredients(this.searchQuery);

    searchObservable.subscribe({
      next: (recipes) => {
        setTimeout(() => {
          this.recipes = recipes;
          this.isLoading = false;
        });
      },
      error: () => setTimeout(() => this.isLoading = false)
    });
  }

  // Comment block removed.
  filterByCategory(categoryId: number): void {
    this.selectedCategory = categoryId;
    this.isLoading = true;
    if (categoryId === 0) {
      this.loadAllRecipes();
    } else {
      this.recipeService.searchByCategory(categoryId).subscribe({
        next: (recipes) => {
          setTimeout(() => {
            this.recipes = recipes;
            this.isLoading = false;
          });
        },
        error: () => setTimeout(() => this.isLoading = false)
      });
    }
  }

  // Comment block removed.
  viewRecipe(id: number): void {
    this.router.navigate(['/recipe', id]);
  }

  // Comment block removed.
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
