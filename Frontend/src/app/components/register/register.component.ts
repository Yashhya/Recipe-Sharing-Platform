// Condensed comment block.

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <div class="auth-header">
          <mat-icon class="auth-icon">person_add</mat-icon>
          <h1>Create Account</h1>
          <p>Join our cooking community</p>
        </div>

        <div *ngIf="errorMessage" class="error-banner">
          <mat-icon>error_outline</mat-icon>
          {{ errorMessage }}
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Full Name</mat-label>
            <input matInput formControlName="fullName" placeholder="John Doe">
            <mat-icon matPrefix>person</mat-icon>
            <mat-error *ngIf="registerForm.get('fullName')?.hasError('required')">Name is required</mat-error>
            <mat-error *ngIf="registerForm.get('fullName')?.hasError('minlength')">Minimum 2 characters</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
            <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Invalid email</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">Minimum 6 characters</mat-error>
          </mat-form-field>

          <button mat-raised-button class="submit-btn" type="submit"
                  [disabled]="registerForm.invalid || isLoading">
            <mat-spinner *ngIf="isLoading" diameter="20"></mat-spinner>
            <span *ngIf="!isLoading">Create Account</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign In</a></p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      background: var(--bg-main-gradient);
      padding: 20px;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 40px;
      border-radius: 20px;
      background: var(--bg-card) !important;
      backdrop-filter: blur(20px);
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-md);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .auth-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #e94560;
      margin-bottom: 16px;
    }
    .auth-header h1 {
      color: var(--text-main);
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }
    .auth-header p {
      color: var(--text-muted);
      margin: 0;
    }
    .error-banner {
      background: rgba(244, 67, 54, 0.15);
      border: 1px solid rgba(244, 67, 54, 0.3);
      border-radius: 12px;
      padding: 12px 16px;
      color: #ff6b6b;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 20px;
      font-size: 14px;
    }
    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }
    ::ng-deep .auth-card .mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline__leading,
    ::ng-deep .auth-card .mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline__notch,
    ::ng-deep .auth-card .mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline__trailing {
      border-color: var(--border-input) !important;
    }
    ::ng-deep .auth-card .mat-mdc-form-field .mat-mdc-input-element {
      color: var(--text-main) !important;
    }
    ::ng-deep .auth-card .mat-mdc-form-field .mat-mdc-floating-label {
      color: var(--text-muted) !important;
    }
    ::ng-deep .auth-card .mat-mdc-form-field .mat-mdc-form-field-icon-prefix mat-icon {
      color: var(--text-faint);
    }
    .submit-btn {
      width: 100%;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #e94560, #ff6b6b) !important;
      color: white !important;
      border-radius: 12px !important;
      margin-top: 8px;
      transition: all 0.3s ease;
    }
    .submit-btn:hover:not([disabled]) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(233, 69, 96, 0.4);
    }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
    }
    .auth-footer p { color: var(--text-muted); }
    .auth-footer a {
      color: #e94560;
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
