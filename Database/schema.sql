-- Condensed SQL comment block.
-- Purpose: This SQL script creates the complete database schema
-- for the Recipe Sharing Platform. It follows Third Normal Form
-- (3NF) normalization to eliminate data redundancy and ensure
-- data integrity.
--
-- WHY NORMALIZATION (3NF)?
-- - Eliminates redundant data storage (e.g., category names
--   are stored once in Categories table, not repeated in Recipes)
-- - Prevents update anomalies (changing a category name updates
--   it everywhere automatically via foreign key relationships)
-- - Ensures data consistency across the application
-- - Makes the database easier to maintain and extend

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS RecipeSharingDB;
USE RecipeSharingDB;

-- Condensed SQL comment block.
-- TABLE: Users
-- Purpose: Stores registered user information including
-- hashed passwords for security. This is the central identity
-- table that other tables reference.
CREATE TABLE IF NOT EXISTS Users (
    UserId INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Condensed SQL comment block.
-- TABLE: Categories
-- Purpose: Stores recipe categories (e.g., Breakfast, Lunch,
-- Dessert). Separated into its own table for normalization -
-- this prevents storing category names repeatedly in the
-- Recipes table and allows easy category management.
CREATE TABLE IF NOT EXISTS Categories (
    CategoryId INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) UNIQUE NOT NULL,
    Description VARCHAR(500)
);

-- Condensed SQL comment block.
-- TABLE: Recipes
-- Purpose: Core table storing all recipe information. Each
-- recipe belongs to one user (author) and one category.
-- This table uses foreign keys to maintain referential integrity.
CREATE TABLE IF NOT EXISTS Recipes (
    RecipeId INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Ingredients LONGTEXT NOT NULL,
    Steps LONGTEXT NOT NULL,
    ImageUrl VARCHAR(500),
    CookingTime INT,
    Servings INT,
    UserId INT NOT NULL,
    CategoryId INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (CategoryId) REFERENCES Categories(CategoryId) ON DELETE CASCADE
);

-- Condensed SQL comment block.
-- TABLE: Ratings
-- Purpose: Stores user ratings for recipes (1-5 stars).
-- Each user can rate a recipe only once, enforced by a
-- UNIQUE constraint on (RecipeId, UserId).
CREATE TABLE IF NOT EXISTS Ratings (
    RatingId INT AUTO_INCREMENT PRIMARY KEY,
    RecipeId INT NOT NULL,
    UserId INT NOT NULL,
    Rating INT NOT NULL CHECK (Rating >= 1 AND Rating <= 5),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_recipe_user (RecipeId, UserId),
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Condensed SQL comment block.
-- TABLE: Comments
-- Purpose: Stores user comments on recipes. Unlike ratings,
-- a user can post multiple comments on the same recipe.
-- Comments are linked to both the recipe and the commenting user.
CREATE TABLE IF NOT EXISTS Comments (
    CommentId INT AUTO_INCREMENT PRIMARY KEY,
    RecipeId INT NOT NULL,
    UserId INT NOT NULL,
    CommentText LONGTEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

-- Condensed SQL comment block.
-- SEED DATA: Default Categories
-- Purpose: Pre-populate the Categories table with common
-- recipe categories so the application is ready to use
-- immediately after database setup.
-- ============================================================
INSERT IGNORE INTO Categories (CategoryName, Description) VALUES
('Breakfast', 'Morning meals and brunch recipes'),
('Lunch', 'Midday meals and light fare'),
('Dinner', 'Evening meals and hearty dishes'),
('Dessert', 'Sweet treats and baked goods'),
('Appetizer', 'Starters and finger foods'),
('Snack', 'Quick bites and light snacks'),
('Beverage', 'Drinks, smoothies, and cocktails'),
('Salad', 'Fresh salads and dressings'),
('Soup', 'Soups, stews, and chowders'),
('Vegan', 'Plant-based recipes');
