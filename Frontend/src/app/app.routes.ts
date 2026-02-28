// Condensed comment block.

import { Routes } from '@angular/router';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { MyRecipesComponent } from './components/my-recipes/my-recipes.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
    // Home page - shows all recipes with search
    { path: '', component: RecipeListComponent },

    // Recipe detail page - :id is a route parameter
    { path: 'recipe/:id', component: RecipeDetailComponent },

    // Create new recipe form
    { path: 'add-recipe', component: RecipeFormComponent },

    // Edit existing recipe - reuses RecipeFormComponent in edit mode
    { path: 'edit-recipe/:id', component: RecipeFormComponent },

    // User's own recipes
    { path: 'my-recipes', component: MyRecipesComponent },

    // Authentication pages
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    // Admin Dashboard
    { path: 'admin', component: AdminDashboardComponent },

    // Wildcard - redirects unknown routes to home
    { path: '**', redirectTo: '' }
];
