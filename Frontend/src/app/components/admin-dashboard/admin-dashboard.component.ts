import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { AdminService, UserAdmin } from '../../services/admin.service';
import { Recipe } from '../../models/recipe.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [
        CommonModule, MatCardModule, MatTabsModule, MatTableModule,
        MatButtonModule, MatIconModule, MatProgressSpinnerModule,
        BaseChartDirective
    ],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
    users: UserAdmin[] = [];
    recipes: Recipe[] = [];

    userColumns: string[] = ['userId', 'fullName', 'email', 'role', 'createdAt', 'actions'];
    recipeColumns: string[] = ['recipeId', 'title', 'categoryName', 'authorName', 'createdAt', 'actions'];

    isLoadingUsers = true;
    isLoadingRecipes = true;
    isLoadingAnalytics = true;

    analytics: any = null;

    // Charts Config
    public barChartOptions: ChartOptions = { responsive: true };
    public lineChartOptions: ChartOptions = { responsive: true };
    public pieChartOptions: ChartOptions = { responsive: true };

    public registrationsChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
    public activeUsersChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
    public mostViewedRecipeData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };

    constructor(
        private adminService: AdminService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.loadAnalytics();
        this.loadUsers();
        this.loadRecipes();
    }

    loadAnalytics(): void {
        this.isLoadingAnalytics = true;
        this.adminService.getAnalytics().subscribe({
            next: (data) => {
                this.analytics = data;

                // Active vs Inactive
                this.activeUsersChartData = {
                    labels: ['Active', 'Inactive'],
                    datasets: [{ data: [data.activeUsers, data.inactiveUsers], backgroundColor: ['#4caf50', '#f44336'] }]
                };

                // Registrations
                this.registrationsChartData = {
                    labels: data.userRegistrationStats.map((s: any) => s.date),
                    datasets: [{ data: data.userRegistrationStats.map((s: any) => s.count), label: 'Registrations', borderColor: '#e94560', fill: true, backgroundColor: 'rgba(233,69,96,0.2)' }]
                };

                // Most Viewed
                this.mostViewedRecipeData = {
                    labels: data.mostViewedRecipes.map((r: any) => r.title.length > 20 ? r.title.substring(0, 20) + '...' : r.title),
                    datasets: [{ data: data.mostViewedRecipes.map((r: any) => r.views), label: 'Views', backgroundColor: '#3f51b5' }]
                };

                this.isLoadingAnalytics = false;
            },
            error: () => {
                this.isLoadingAnalytics = false;
                this.snackBar.open('Failed to load analytics', 'Close', { duration: 3000 });
            }
        });
    }

    loadUsers(): void {
        this.isLoadingUsers = true;
        this.adminService.getAllUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.isLoadingUsers = false;
            },
            error: () => {
                this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
                this.isLoadingUsers = false;
            }
        });
    }

    loadRecipes(): void {
        this.isLoadingRecipes = true;
        this.adminService.getAllRecipes().subscribe({
            next: (recipes) => {
                this.recipes = recipes;
                this.isLoadingRecipes = false;
            },
            error: () => {
                this.snackBar.open('Failed to load recipes', 'Close', { duration: 3000 });
                this.isLoadingRecipes = false;
            }
        });
    }

    deleteUser(userId: number): void {
        if (confirm('Are you sure you want to delete this user AND all their recipes/comments?')) {
            this.adminService.deleteUser(userId).subscribe({
                next: () => {
                    this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
                    this.loadUsers(); // Refresh list
                    this.loadRecipes(); // Since recipes might cascade delete
                },
                error: () => {
                    this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
                }
            });
        }
    }

    deleteRecipe(recipeId: number): void {
        if (confirm('Are you sure you want to delete this recipe?')) {
            this.adminService.deleteRecipe(recipeId).subscribe({
                next: () => {
                    this.snackBar.open('Recipe deleted successfully', 'Close', { duration: 3000 });
                    this.loadRecipes(); // Refresh list
                },
                error: () => {
                    this.snackBar.open('Failed to delete recipe', 'Close', { duration: 3000 });
                }
            });
        }
    }
}
