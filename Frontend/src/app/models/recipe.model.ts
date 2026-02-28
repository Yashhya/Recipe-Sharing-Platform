// Condensed comment block.

// Comment block removed.
export interface Recipe {
  recipeId: number;
  title: string;
  ingredients: string;
  steps: string;
  imageUrl?: string;       // Optional - not all recipes have images
  cookingTime?: number;    // Optional - cooking time in minutes
  servings?: number;       // Optional - number of servings
  userId: number;
  categoryId: number;
  authorName: string;      // From Users table JOIN
  categoryName: string;    // From Categories table JOIN
  averageRating: number;   // Calculated from Ratings table
  createdAt: string;       // ISO date string from backend
  updatedAt: string;
}

// Comment block removed.
export interface RecipeDto {
  title: string;
  ingredients: string;
  steps: string;
  imageUrl?: string;
  cookingTime?: number;
  servings?: number;
  categoryId: number;
}

// Comment block removed.
export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
  createdAt: string;
}

// Comment block removed.
export interface Comment {
  commentId: number;
  recipeId: number;
  userId: number;
  commentText: string;
  userName: string;        // From Users table JOIN
  createdAt: string;
}

// Comment block removed.
export interface CommentDto {
  commentText: string;
}

// Comment block removed.
export interface RatingDto {
  ratingValue: number;
}

// Comment block removed.
export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
}

// Comment block removed.
export interface LoginDto {
  email: string;
  password: string;
}

// Comment block removed.
export interface AuthResponse {
  token: string;
  userId: number;
  fullName: string;
  email: string;
  role: string;
}
