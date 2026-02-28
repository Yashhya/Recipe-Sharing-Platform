# RecipeHub - Recipe Sharing Platform

A modern, full-stack recipe sharing platform built with .NET 8, Angular 21, and MySQL.

## ✨ Features
- **User Authentication**: Secure JWT-based login and registration.
- **Recipe Management**: Create, edit, and delete recipes with image uploads.
- **Search & Filter**: Search by title, ingredients, or category.
- **Interactive Community**: Rate and comment on recipes.
- **Admin Dashboard**: Manage users, recipes, and view platform analytics.
- **Dynamic UI**: Responsive and premium design using Angular Material and Chart.js.

## 🛠️ Technology Stack
- **Backend**: ASP.NET Core Web API (C#)
- **Frontend**: Angular 21, TypeScript, Vanilla CSS
- **Database**: MySQL
- **Tooling**: Visual Studio 17.10+ (Solution SLNX support)

## 🚀 Getting Started

### Prerequisites
- .NET 8 SDK
- Node.js & npm
- MySQL Server

### Project Setup

#### 1. Database Configuration
1. Create a database named `RecipeSharingDB`.
2. Run the scripts in the `/Database` folder:
   - `schema.sql`: Sets up the tables.
   - `seed_recipes.sql`: Optional sample data.

#### 2. Backend Setup
1. Navigate to the `Backend` folder.
2. Update `appsettings.json` with your MySQL connection string.
3. Run the API:
   ```bash
   dotnet run
   ```
4. Access Swagger UI: `http://localhost:5147/swagger`

#### 3. Frontend Setup
1. Navigate to the `Frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm start
   ```
4. Access the App: `http://localhost:4200`

## 💻 Visual Studio Integration
This project is configured for **Visual Studio 2022**. 
- Open `RecipeSharingPlatform.slnx` to load both Backend and Frontend projects simultaneously.
- Set **Multiple Startup Projects** to run both the API and Angular server with one click (F5).

## 📁 Repository Structure
```text
├── Backend/          # ASP.NET Core API
├── Frontend/         # Angular Application
├── Database/         # SQL Scripts
└── RecipeSharingPlatform.slnx  # Visual Studio Solution
```

---
*Created by Yash - Recipe Sharing Platform Project*
