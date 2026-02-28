// Condensed comment block.

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <!-- Main navigation toolbar with gradient background -->
    <mat-toolbar class="navbar">
      <div class="navbar-content">
        <!-- Logo and app title - clicking navigates to home -->
        <a routerLink="/" class="logo-link">
          <mat-icon class="logo-icon">restaurant_menu</mat-icon>
          <span class="app-title">RecipeHub</span>
        </a>

        <!-- Navigation links - right side -->
        <div class="nav-links">
          <a mat-button routerLink="/" class="nav-link">
            <mat-icon>explore</mat-icon>
            <span>Explore</span>
          </a>

          <!-- Show these links only when user IS logged in -->
          <ng-container *ngIf="authService.isLoggedIn()">
            <a mat-button routerLink="/add-recipe" class="nav-link">
              <mat-icon>add_circle</mat-icon>
              <span>Add Recipe</span>
            </a>
            <a mat-button routerLink="/my-recipes" class="nav-link">
              <mat-icon>book</mat-icon>
              <span>My Recipes</span>
            </a>
            
            <a *ngIf="authService.isAdmin()" mat-button routerLink="/admin" class="nav-link">
              <mat-icon>security</mat-icon>
              <span>Admin Panel</span>
            </a>
          </ng-container>

          <!-- User menu (logged in) or Auth buttons (logged out) -->
          <ng-container *ngIf="authService.isLoggedIn(); else authButtons">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-btn">
              <mat-icon>account_circle</mat-icon>
              <span>{{ authService.getFullName() }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </ng-container>

          <ng-template #authButtons>
            <a mat-raised-button routerLink="/login" class="login-btn">Login</a>
            <a mat-raised-button routerLink="/register" class="register-btn">Sign Up</a>
          </ng-template>

          <!-- Theme Toggle -->
          <button mat-icon-button (click)="themeService.toggleTheme()" class="nav-link theme-toggle" title="Toggle Theme">
             <mat-icon>{{ themeService.isDark ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      background: var(--bg-nav);
      color: var(--text-nav);
      padding: 0 24px;
      height: 64px;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }
    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }
    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--text-nav);
      gap: 8px;
    }
    .logo-icon {
      color: #e94560;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .app-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 1px;
      background: linear-gradient(90deg, #e94560, #ff6b6b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-link {
      color: var(--text-nav) !important;
      transition: all 0.3s ease;
    }
    .nav-link:hover {
      color: var(--text-nav-hover) !important;
      transform: translateY(-1px);
    }
    .nav-link mat-icon {
      margin-right: 4px;
      font-size: 20px;
    }
    .user-menu-btn {
      color: var(--text-nav) !important;
    }
    .login-btn {
      background: transparent !important;
      border: 1px solid var(--text-faint) !important;
      color: var(--text-nav) !important;
      transition: all 0.3s ease;
    }
    .login-btn:hover {
      border-color: var(--text-nav) !important;
      background: rgba(0, 0, 0, 0.05) !important;
    }
    .register-btn {
      background: linear-gradient(135deg, #e94560, #ff6b6b) !important;
      color: white !important;
      border: none !important;
      transition: all 0.3s ease;
    }
    .register-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
    }
    .theme-toggle mat-icon { margin: 0; }
  `]
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    public themeService: ThemeService,
    private router: Router
  ) { }

  // Comment block removed.
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
