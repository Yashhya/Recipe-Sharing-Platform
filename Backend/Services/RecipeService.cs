// Condensed comment block.

using RecipeSharingAPI.Data;
using RecipeSharingAPI.Models;
using MySql.Data.MySqlClient;
using System.Data;

namespace RecipeSharingAPI.Services
{
    /// <summary>
    public class RecipeService
    {
        private readonly DbHelper _dbHelper;

        public RecipeService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        /// <summary>
        public List<Recipe> GetAllRecipes()
        {
            var query = @"
                SELECT r.*, 
                       u.FullName AS AuthorName, 
                       c.CategoryName,
                       COALESCE((SELECT AVG(rt.RatingValue) FROM Ratings rt WHERE rt.RecipeId = r.RecipeId), 0) AS AverageRating
                FROM Recipes r
                LEFT JOIN Users u ON r.UserId = u.UserId
                LEFT JOIN Categories c ON r.CategoryId = c.CategoryId
                ORDER BY r.CreatedAt DESC";

            var dt = _dbHelper.ExecuteQuery(query);
            return MapRecipes(dt);
        }

        /// <summary>
        public Recipe? GetRecipeById(int id)
        {
            var query = @"
                SELECT r.*, 
                       u.FullName AS AuthorName, 
                       c.CategoryName,
                       COALESCE((SELECT AVG(rt.RatingValue) FROM Ratings rt WHERE rt.RecipeId = r.RecipeId), 0) AS AverageRating
                FROM Recipes r
                LEFT JOIN Users u ON r.UserId = u.UserId
                LEFT JOIN Categories c ON r.CategoryId = c.CategoryId
                WHERE r.RecipeId = @RecipeId";

            var parameters = new[] {
                new MySqlParameter("@RecipeId", id)
            };

            var dt = _dbHelper.ExecuteQuery(query, parameters);
            var recipes = MapRecipes(dt);
            var recipe = recipes.FirstOrDefault();
            
            if (recipe != null)
            {
                // Increment views for analytics
                var updateQuery = "UPDATE Recipes SET Views = Views + 1 WHERE RecipeId = @RecipeId";
                _dbHelper.ExecuteNonQuery(updateQuery, parameters);
                recipe.Views += 1; // Update object in-memory before returning
            }
            
            return recipe;
        }

        /// <summary>
        public List<Recipe> GetRecipesByUser(int userId)
        {
            var query = @"
                SELECT r.*, 
                       u.FullName AS AuthorName, 
                       c.CategoryName,
                       COALESCE((SELECT AVG(rt.RatingValue) FROM Ratings rt WHERE rt.RecipeId = r.RecipeId), 0) AS AverageRating
                FROM Recipes r
                LEFT JOIN Users u ON r.UserId = u.UserId
                LEFT JOIN Categories c ON r.CategoryId = c.CategoryId
                WHERE r.UserId = @UserId
                ORDER BY r.CreatedAt DESC";

            var parameters = new[] {
                new MySqlParameter("@UserId", userId)
            };

            var dt = _dbHelper.ExecuteQuery(query, parameters);
            return MapRecipes(dt);
        }

        /// <summary>
        public Recipe? CreateRecipe(RecipeDto dto, int userId)
        {
            var query = @"INSERT INTO Recipes (Title, Ingredients, Steps, ImageUrl, CookingTime, Servings, UserId, CategoryId) 
                          VALUES (@Title, @Ingredients, @Steps, @ImageUrl, @CookingTime, @Servings, @UserId, @CategoryId);
                          SELECT LAST_INSERT_ID();";

            var parameters = new[] {
                new MySqlParameter("@Title", dto.Title),
                new MySqlParameter("@Ingredients", dto.Ingredients),
                new MySqlParameter("@Steps", dto.Steps),
                new MySqlParameter("@ImageUrl", (object?)dto.ImageUrl ?? DBNull.Value),
                new MySqlParameter("@CookingTime", (object?)dto.CookingTime ?? DBNull.Value),
                new MySqlParameter("@Servings", (object?)dto.Servings ?? DBNull.Value),
                new MySqlParameter("@UserId", userId),
                new MySqlParameter("@CategoryId", dto.CategoryId)
            };

            // ExecuteScalar returns the LAST_INSERT_ID() - the auto-generated RecipeId
            var result = _dbHelper.ExecuteScalar(query, parameters);
            var newId = Convert.ToInt32(result);

            // Return the full recipe with all joined data
            return GetRecipeById(newId);
        }

        /// <summary>
        public Recipe? UpdateRecipe(int id, RecipeDto dto, int userId)
        {
            // Only allow the recipe owner to update it
            var query = @"UPDATE Recipes 
                          SET Title = @Title, 
                              Ingredients = @Ingredients, 
                              Steps = @Steps, 
                              ImageUrl = @ImageUrl, 
                              CookingTime = @CookingTime, 
                              Servings = @Servings, 
                              CategoryId = @CategoryId
                          WHERE RecipeId = @RecipeId AND UserId = @UserId";

            var parameters = new[] {
                new MySqlParameter("@Title", dto.Title),
                new MySqlParameter("@Ingredients", dto.Ingredients),
                new MySqlParameter("@Steps", dto.Steps),
                new MySqlParameter("@ImageUrl", (object?)dto.ImageUrl ?? DBNull.Value),
                new MySqlParameter("@CookingTime", (object?)dto.CookingTime ?? DBNull.Value),
                new MySqlParameter("@Servings", (object?)dto.Servings ?? DBNull.Value),
                new MySqlParameter("@CategoryId", dto.CategoryId),
                new MySqlParameter("@RecipeId", id),
                new MySqlParameter("@UserId", userId)
            };

            var rowsAffected = _dbHelper.ExecuteNonQuery(query, parameters);

            // If 0 rows affected, either recipe doesn't exist or user doesn't own it
            if (rowsAffected == 0) return null;

            return GetRecipeById(id);
        }

        /// <summary>
        public bool DeleteRecipe(int id, int userId)
        {
            var query = "DELETE FROM Recipes WHERE RecipeId = @RecipeId AND UserId = @UserId";
            var parameters = new[] {
                new MySqlParameter("@RecipeId", id),
                new MySqlParameter("@UserId", userId)
            };

            var rowsAffected = _dbHelper.ExecuteNonQuery(query, parameters);
            return rowsAffected > 0;
        }

        /// <summary>
        public List<Recipe> SearchByTitle(string title)
        {
            var query = @"
                SELECT r.*, 
                       u.FullName AS AuthorName, 
                       c.CategoryName,
                       COALESCE((SELECT AVG(rt.RatingValue) FROM Ratings rt WHERE rt.RecipeId = r.RecipeId), 0) AS AverageRating
                FROM Recipes r
                LEFT JOIN Users u ON r.UserId = u.UserId
                LEFT JOIN Categories c ON r.CategoryId = c.CategoryId
                WHERE r.Title LIKE @Search
                ORDER BY r.CreatedAt DESC";

            var parameters = new[] {
                new MySqlParameter("@Search", $"%{title}%")
            };

            var dt = _dbHelper.ExecuteQuery(query, parameters);
            return MapRecipes(dt);
        }

        /// <summary>
        public List<Recipe> SearchByIngredients(string ingredients)
        {
            var query = @"
                SELECT r.*, 
                       u.FullName AS AuthorName, 
                       c.CategoryName,
                       COALESCE((SELECT AVG(rt.RatingValue) FROM Ratings rt WHERE rt.RecipeId = r.RecipeId), 0) AS AverageRating
                FROM Recipes r
                LEFT JOIN Users u ON r.UserId = u.UserId
                LEFT JOIN Categories c ON r.CategoryId = c.CategoryId
                WHERE MATCH(r.Ingredients) AGAINST(@Search IN NATURAL LANGUAGE MODE)
                ORDER BY r.CreatedAt DESC";

            var parameters = new[] {
                new MySqlParameter("@Search", ingredients)
            };

            var dt = _dbHelper.ExecuteQuery(query, parameters);
            return MapRecipes(dt);
        }

        /// <summary>
        public List<Recipe> SearchByCategory(int categoryId)
        {
            var query = @"
                SELECT r.*, 
                       u.FullName AS AuthorName, 
                       c.CategoryName,
                       COALESCE((SELECT AVG(rt.RatingValue) FROM Ratings rt WHERE rt.RecipeId = r.RecipeId), 0) AS AverageRating
                FROM Recipes r
                LEFT JOIN Users u ON r.UserId = u.UserId
                LEFT JOIN Categories c ON r.CategoryId = c.CategoryId
                WHERE r.CategoryId = @CategoryId
                ORDER BY r.CreatedAt DESC";

            var parameters = new[] {
                new MySqlParameter("@CategoryId", categoryId)
            };

            var dt = _dbHelper.ExecuteQuery(query, parameters);
            return MapRecipes(dt);
        }

        /// <summary>
        private List<Recipe> MapRecipes(DataTable dt)
        {
            var recipes = new List<Recipe>();
            foreach (DataRow row in dt.Rows)
            {
                recipes.Add(new Recipe
                {
                    RecipeId = Convert.ToInt32(row["RecipeId"]),
                    Title = row["Title"].ToString()!,
                    Ingredients = row["Ingredients"].ToString()!,
                    Steps = row["Steps"].ToString()!,
                    // Handle nullable columns using conditional check
                    ImageUrl = row["ImageUrl"] == DBNull.Value ? null : row["ImageUrl"].ToString(),
                    CookingTime = row["CookingTime"] == DBNull.Value ? null : Convert.ToInt32(row["CookingTime"]),
                    Servings = row["Servings"] == DBNull.Value ? null : Convert.ToInt32(row["Servings"]),
                    UserId = Convert.ToInt32(row["UserId"]),
                    CategoryId = Convert.ToInt32(row["CategoryId"]),
                    AuthorName = row["AuthorName"]?.ToString() ?? "Unknown",
                    CategoryName = row["CategoryName"]?.ToString() ?? "Uncategorized",
                    AverageRating = row["AverageRating"] == DBNull.Value ? 0 : Convert.ToDouble(row["AverageRating"]),
                    CreatedAt = Convert.ToDateTime(row["CreatedAt"]),
                    UpdatedAt = Convert.ToDateTime(row["UpdatedAt"]),
                    Views = row.Table.Columns.Contains("Views") && row["Views"] != DBNull.Value ? Convert.ToInt32(row["Views"]) : 0
                });
            }
            return recipes;
        }
    }
}
