// Condensed comment block.

using RecipeSharingAPI.Data;
using RecipeSharingAPI.Models;
using MySql.Data.MySqlClient;
using System.Data;

namespace RecipeSharingAPI.Services
{
    /// <summary>
    public class RatingService
    {
        private readonly DbHelper _dbHelper;

        public RatingService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        /// <summary>
        public bool AddOrUpdateRating(int recipeId, int userId, int ratingValue)
        {
            // Validate rating range (defense in depth - DB also has CHECK constraint)
            if (ratingValue < 1 || ratingValue > 5)
                return false;

            var query = @"INSERT INTO Ratings (RecipeId, UserId, RatingValue) 
                          VALUES (@RecipeId, @UserId, @RatingValue)
                          ON DUPLICATE KEY UPDATE RatingValue = @RatingValue";

            var parameters = new[] {
                new MySqlParameter("@RecipeId", recipeId),
                new MySqlParameter("@UserId", userId),
                new MySqlParameter("@RatingValue", ratingValue)
            };

            _dbHelper.ExecuteNonQuery(query, parameters);
            return true;
        }

        /// <summary>
        public double GetAverageRating(int recipeId)
        {
            var query = @"SELECT COALESCE(AVG(RatingValue), 0) 
                          FROM Ratings WHERE RecipeId = @RecipeId";

            var parameters = new[] {
                new MySqlParameter("@RecipeId", recipeId)
            };

            var result = _dbHelper.ExecuteScalar(query, parameters);
            return Convert.ToDouble(result);
        }

        /// <summary>
        public int GetUserRating(int recipeId, int userId)
        {
            var query = @"SELECT RatingValue FROM Ratings 
                          WHERE RecipeId = @RecipeId AND UserId = @UserId";

            var parameters = new[] {
                new MySqlParameter("@RecipeId", recipeId),
                new MySqlParameter("@UserId", userId)
            };

            var result = _dbHelper.ExecuteScalar(query, parameters);
            return result == null || result == DBNull.Value ? 0 : Convert.ToInt32(result);
        }
    }
}
