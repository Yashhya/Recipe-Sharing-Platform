// Condensed comment block.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RecipeService } from '../../services/recipe.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/recipe.model';

@Component({
    selector: 'app-recipe-form',
    standalone: true,
    imports: [
        CommonModule, ReactiveFormsModule,
        MatCardModule, MatFormFieldModule, MatInputModule,
        MatSelectModule, MatButtonModule, MatIconModule,
        MatProgressSpinnerModule, MatSnackBarModule
    ],
    templateUrl: './recipe-form.component.html',
    styleUrl: './recipe-form.component.css'
})
export class RecipeFormComponent implements OnInit {
    recipeForm: FormGroup;
    categories: Category[] = [];
    isEditMode = false;
    recipeId = 0;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private recipeService: RecipeService,
        private categoryService: CategoryService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.recipeForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(3)]],
            categoryId: [0, [Validators.required, Validators.min(1)]],
            cookingTime: [null],
            servings: [null],
            imageUrl: [''],
            imageFile: [null],
            ingredients: ['', Validators.required],
            steps: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.categoryService.getAllCategories().subscribe({
            next: (categories) => this.categories = categories
        });

        this.route.params.subscribe(params => {
            if (params['id']) {
                this.isEditMode = true;
                this.recipeId = +params['id'];
                this.loadRecipeForEdit();
            }
        });
    }

    loadRecipeForEdit(): void {
        this.recipeService.getRecipeById(this.recipeId).subscribe({
            next: (recipe) => {
                this.recipeForm.patchValue({
                    title: recipe.title,
                    categoryId: recipe.categoryId,
                    cookingTime: recipe.cookingTime,
                    servings: recipe.servings,
                    imageUrl: recipe.imageUrl,
                    ingredients: recipe.ingredients,
                    steps: recipe.steps
                });
            }
        });
    }

    onSubmit(): void {
        if (this.recipeForm.invalid) return;
        this.isLoading = true;
        const dto = this.recipeForm.value;

        if (this.isEditMode) {
            this.recipeService.updateRecipe(this.recipeId, dto).subscribe({
                next: (recipe) => {
                    this.snackBar.open('Recipe updated!', 'Close', { duration: 2000 });
                    this.router.navigate(['/recipe', recipe.recipeId]);
                },
                error: () => {
                    this.isLoading = false;
                    this.snackBar.open('Failed to update', 'Close', { duration: 3000 });
                }
            });
        } else {
            this.recipeService.createRecipe(dto).subscribe({
                next: (recipe) => {
                    this.snackBar.open('Recipe published!', 'Close', { duration: 2000 });
                    this.router.navigate(['/recipe', recipe.recipeId]);
                },
                error: () => {
                    this.isLoading = false;
                    this.snackBar.open('Failed to create', 'Close', { duration: 3000 });
                }
            });
        }
    }

    previewUrl: string | ArrayBuffer | null = null;

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            // Update the form control with the actual file
            this.recipeForm.patchValue({ imageFile: file });

            // Generate a local preview
            const reader = new FileReader();
            reader.onload = () => {
                this.previewUrl = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

    onPreviewError(event: Event): void {
        (event.target as HTMLImageElement).style.display = 'none';
    }
}
