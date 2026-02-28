// Condensed comment block.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RecipeService } from '../../services/recipe.service';
import { RatingService } from '../../services/rating.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { Recipe, Comment } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDividerModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="detail-container" *ngIf="recipe; else loading">
      <!-- Recipe Header with Image -->
      <div class="recipe-hero">
        <img [src]="recipe.imageUrl || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800'"
             [alt]="recipe.title" class="hero-image"
             (error)="onImageError($event)">
        <div class="hero-overlay">
          <div class="hero-text">
            <span class="category-badge">{{ recipe.categoryName }}</span>
            <h1>{{ recipe.title }}</h1>
            <div class="hero-meta">
              <span><mat-icon>person</mat-icon> {{ recipe.authorName }}</span>
              <span *ngIf="recipe.cookingTime"><mat-icon>schedule</mat-icon> {{ recipe.cookingTime }} min</span>
              <span *ngIf="recipe.servings"><mat-icon>people</mat-icon> {{ recipe.servings }} servings</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit/Delete buttons for recipe owner -->
      <div class="action-bar" *ngIf="isOwner()">
        <button mat-raised-button class="edit-btn" [routerLink]="['/edit-recipe', recipe.recipeId]">
          <mat-icon>edit</mat-icon> Edit Recipe
        </button>
        <button mat-raised-button class="delete-btn" (click)="deleteRecipe()">
          <mat-icon>delete</mat-icon> Delete
        </button>
      </div>

      <div class="content-grid">
        <!-- Left column: Recipe content -->
        <div class="main-content">
          <!-- Ingredients section -->
          <mat-card class="content-card">
            <h2><mat-icon>shopping_cart</mat-icon> Ingredients</h2>
            <mat-divider></mat-divider>
            <div class="ingredients-list">
              <div *ngFor="let ingredient of getIngredientsList()" class="ingredient-item">
                <mat-icon class="check-icon">check_circle</mat-icon>
                <span>{{ ingredient }}</span>
              </div>
            </div>
          </mat-card>

          <!-- Steps section -->
          <mat-card class="content-card">
            <h2><mat-icon>menu_book</mat-icon> Instructions</h2>
            <mat-divider></mat-divider>
            <div class="steps-list">
              <div *ngFor="let step of getStepsList(); let i = index" class="step-item">
                <div class="step-number">{{ i + 1 }}</div>
                <p>{{ step }}</p>
              </div>
            </div>
          </mat-card>
        </div>

        <!-- Right column: Rating & Comments -->
        <div class="sidebar">
          <!-- Rating card -->
          <mat-card class="content-card rating-card">
            <h2><mat-icon>star</mat-icon> Rating</h2>
            <mat-divider></mat-divider>
            <div class="rating-display">
              <span class="big-rating">{{ recipe.averageRating | number:'1.1-1' }}</span>
              <div class="stars-row">
                <mat-icon *ngFor="let star of [1,2,3,4,5]"
                          [class.filled]="star <= recipe.averageRating">
                  {{ star <= recipe.averageRating ? 'star' : 'star_border' }}
                </mat-icon>
              </div>
            </div>

            <!-- Interactive rating for logged-in users -->
            <div *ngIf="authService.isLoggedIn()" class="user-rating">
              <p class="rate-label">Rate this recipe:</p>
              <div class="interactive-stars">
                <mat-icon *ngFor="let star of [1,2,3,4,5]"
                          (click)="rateRecipe(star)"
                          (mouseenter)="hoverRating = star"
                          (mouseleave)="hoverRating = 0"
                          [class.filled]="star <= (hoverRating || userRating)"
                          class="clickable-star">
                  {{ star <= (hoverRating || userRating) ? 'star' : 'star_border' }}
                </mat-icon>
              </div>
            </div>
          </mat-card>

          <!-- Comments card -->
          <mat-card class="content-card comments-card">
            <h2><mat-icon>chat_bubble</mat-icon> Comments ({{ comments.length }})</h2>
            <mat-divider></mat-divider>

            <!-- Add comment form -->
            <div *ngIf="authService.isLoggedIn()" class="add-comment">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Write a comment...</mat-label>
                <textarea matInput [(ngModel)]="newComment" rows="3"></textarea>
              </mat-form-field>
              <button mat-raised-button class="comment-btn" (click)="addComment()"
                      [disabled]="!newComment.trim()">
                <mat-icon>send</mat-icon> Post Comment
              </button>
            </div>

            <div *ngIf="!authService.isLoggedIn()" class="login-prompt">
              <p><a routerLink="/login">Log in</a> to rate and comment</p>
            </div>

            <!-- Comments list -->
            <div class="comments-list">
              <div *ngFor="let comment of comments" class="comment-item">
                <div class="comment-header">
                  <mat-icon class="comment-avatar">account_circle</mat-icon>
                  <div>
                    <strong>{{ comment.userName }}</strong>
                    <span class="comment-date">{{ comment.createdAt | date:'medium' }}</span>
                  </div>
                </div>
                <p class="comment-text">{{ comment.commentText }}</p>
              </div>

              <div *ngIf="comments.length === 0" class="no-comments">
                <mat-icon>chat_bubble_outline</mat-icon>
                <p>No comments yet. Be the first!</p>
              </div>
            </div>
          </mat-card>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner></mat-spinner>
        <p>Loading recipe...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding-bottom: 40px;
    }
    .recipe-hero {
      position: relative;
      height: 400px;
      overflow: hidden;
    }
    .hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .hero-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 40px 32px 32px;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    }
    .hero-text h1 {
      color: white;
      font-size: 36px;
      font-weight: 700;
      margin: 12px 0;
    }
    .category-badge {
      background: rgba(233, 69, 96, 0.9);
      color: white;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
    }
    .hero-meta {
      display: flex;
      gap: 24px;
      color: rgba(255, 255, 255, 0.8);
      font-size: 15px;
    }
    .hero-meta span {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .hero-meta mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .action-bar {
      display: flex;
      gap: 12px;
      padding: 16px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .edit-btn {
      background: rgba(33, 150, 243, 0.2) !important;
      color: #64b5f6 !important;
      border: 1px solid rgba(33, 150, 243, 0.3) !important;
    }
    .delete-btn {
      background: rgba(244, 67, 54, 0.2) !important;
      color: #ef5350 !important;
      border: 1px solid rgba(244, 67, 54, 0.3) !important;
    }
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;
      padding: 24px;
    }
    @media (max-width: 900px) {
      .content-grid { grid-template-columns: 1fr; }
    }
    .content-card {
      border-radius: 16px !important;
      background: var(--bg-card) !important;
      border: 1px solid var(--border-medium);
      padding: 24px !important;
      margin-bottom: 24px;
      box-shadow: var(--shadow-sm);
    }
    .content-card h2 {
      color: var(--text-main);
      font-size: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 16px 0;
    }
    .content-card h2 mat-icon {
      color: #e94560;
    }
    .content-card mat-divider {
      border-color: var(--border-medium) !important;
      margin-bottom: 20px;
    }
    .ingredients-list {
      display: grid;
      gap: 10px;
    }
    .ingredient-item {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--text-main);
      padding: 8px 12px;
      border-radius: 8px;
      background: var(--bg-ingredient);
    }
    .check-icon {
      color: #4caf50;
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
    }
    .steps-list {
      display: grid;
      gap: 20px;
    }
    .step-item {
      display: flex;
      gap: 16px;
    }
    .step-number {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #e94560, #ff6b6b);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }
    .step-item p {
      color: var(--text-main);
      margin: 4px 0 0 0;
      line-height: 1.6;
    }
    .rating-display {
      text-align: center;
      margin-bottom: 16px;
    }
    .big-rating {
      font-size: 48px;
      font-weight: 700;
      color: #ffc107;
    }
    .stars-row {
      display: flex;
      justify-content: center;
      gap: 4px;
    }
    .stars-row mat-icon, .interactive-stars mat-icon {
      color: #ddd;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .stars-row .filled, .interactive-stars .filled {
      color: #ffc107 !important;
    }
    .user-rating { text-align: center; }
    .rate-label {
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .interactive-stars {
      display: flex;
      justify-content: center;
      gap: 4px;
    }
    .clickable-star {
      cursor: pointer;
      transition: transform 0.2s ease;
    }
    .clickable-star:hover {
      transform: scale(1.2);
    }
    .full-width { width: 100%; }
    .comment-btn {
      background: linear-gradient(135deg, #e94560, #ff6b6b) !important;
      color: white !important;
      width: 100%;
    }
    .login-prompt {
      text-align: center;
      color: var(--text-muted);
      padding: 16px;
    }
    .login-prompt a {
      color: #e94560;
      text-decoration: none;
      font-weight: 600;
    }
    .comments-list {
      margin-top: 20px;
    }
    .comment-item {
      padding: 16px;
      border-radius: 12px;
      background: var(--bg-ingredient);
      margin-bottom: 12px;
    }
    .comment-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }
    .comment-avatar {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: rgba(0, 0, 0, 0.4);
    }
    .comment-header strong { color: var(--text-main); font-size: 14px; }
    .comment-date {
      color: rgba(0, 0, 0, 0.4);
      font-size: 12px;
      display: block;
    }
    .comment-text {
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
    }
    .no-comments {
      text-align: center;
      color: var(--text-faint);
      padding: 20px;
    }
    .no-comments mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      color: var(--text-muted);
      gap: 16px;
    }

    ::ng-deep .comments-card .mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline__leading,
    ::ng-deep .comments-card .mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline__notch,
    ::ng-deep .comments-card .mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline__trailing {
      border-color: var(--border-input) !important;
    }
    ::ng-deep .comments-card .mat-mdc-form-field .mat-mdc-input-element {
      color: var(--text-main) !important;
    }
    ::ng-deep .comments-card .mat-mdc-form-field .mat-mdc-floating-label {
      color: var(--text-muted) !important;
    }
  `]
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | null = null;
  comments: Comment[] = [];
  userRating = 0;
  hoverRating = 0;
  newComment = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private ratingService: RatingService,
    private commentService: CommentService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  // Comment block removed.
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loadRecipe(id);
      this.loadComments(id);
      if (this.authService.isLoggedIn()) {
        this.loadUserRating(id);
      }
    });
  }

  loadRecipe(id: number): void {
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => this.recipe = recipe,
      error: () => this.router.navigate(['/'])
    });
  }

  loadComments(recipeId: number): void {
    this.commentService.getCommentsByRecipe(recipeId).subscribe({
      next: (comments) => this.comments = comments
    });
  }

  loadUserRating(recipeId: number): void {
    this.ratingService.getUserRating(recipeId).subscribe({
      next: (res) => this.userRating = res.ratingValue
    });
  }

  // Comment block removed.
  isOwner(): boolean {
    return this.authService.getUserId() === this.recipe?.userId;
  }

  // Comment block removed.
  getIngredientsList(): string[] {
    return this.recipe?.ingredients.split(',').map(i => i.trim()).filter(i => i) || [];
  }

  // Comment block removed.
  getStepsList(): string[] {
    return this.recipe?.steps.split('\n').map(s => s.trim()).filter(s => s) || [];
  }

  // Comment block removed.
  rateRecipe(value: number): void {
    if (!this.recipe) return;
    this.ratingService.rateRecipe(this.recipe.recipeId, value).subscribe({
      next: (res) => {
        this.userRating = value;
        this.recipe!.averageRating = res.averageRating;
        this.snackBar.open('Rating submitted!', 'Close', { duration: 2000 });
      }
    });
  }

  // Comment block removed.
  addComment(): void {
    if (!this.recipe || !this.newComment.trim()) return;
    this.commentService.addComment(this.recipe.recipeId, { commentText: this.newComment }).subscribe({
      next: (comment) => {
        this.comments.unshift(comment);
        this.newComment = '';
        this.snackBar.open('Comment posted!', 'Close', { duration: 2000 });
      }
    });
  }

  // Comment block removed.
  deleteRecipe(): void {
    if (!this.recipe) return;
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(this.recipe.recipeId).subscribe({
        next: () => {
          this.snackBar.open('Recipe deleted', 'Close', { duration: 2000 });
          this.router.navigate(['/']);
        }
      });
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
