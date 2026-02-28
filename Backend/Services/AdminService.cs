using RecipeSharingAPI.Data;
using RecipeSharingAPI.Models;
using MySql.Data.MySqlClient;
using System.Data;

namespace RecipeSharingAPI.Services
{
    public class AdminService
    {
        private readonly DbHelper _dbHelper;

        public AdminService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        public List<User> GetAllUsers()
        {
            var query = "SELECT UserId, FullName, Email, Role, CreatedAt FROM Users ORDER BY CreatedAt DESC";
            var dt = _dbHelper.ExecuteQuery(query);
            var users = new List<User>();
            
            foreach (DataRow row in dt.Rows)
            {
                users.Add(new User
                {
                    UserId = Convert.ToInt32(row["UserId"]),
                    FullName = row["FullName"].ToString()!,
                    Email = row["Email"].ToString()!,
                    Role = row["Role"].ToString()!,
                    CreatedAt = Convert.ToDateTime(row["CreatedAt"])
                });
            }
            return users;
        }

        public bool DeleteUser(int userId)
        {
            // Because of ON DELETE CASCADE in db schema (if it exists) it will delete all associated data
            // But let's be safe and do a direct delete
            var query = "DELETE FROM Users WHERE UserId = @UserId";
            var param = new[] { new MySqlParameter("@UserId", userId) };
            return _dbHelper.ExecuteNonQuery(query, param) > 0;
        }
        
        public bool DeleteRecipe(int recipeId)
        {
            var query = "DELETE FROM Recipes WHERE RecipeId = @RecipeId";
            var param = new[] { new MySqlParameter("@RecipeId", recipeId) };
            return _dbHelper.ExecuteNonQuery(query, param) > 0;
        }

        public AnalyticsDto GetAnalytics()
        {
            var analytics = new AnalyticsDto();

            // Total users and active/inactive breakdown (Active = logged in last 30 days)
            var usersQuery = @"
                SELECT 
                    COUNT(*) as TotalUsers,
                    SUM(CASE WHEN LastLogin >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) as ActiveUsers,
                    SUM(CASE WHEN LastLogin < DATE_SUB(NOW(), INTERVAL 30 DAY) OR LastLogin IS NULL THEN 1 ELSE 0 END) as InactiveUsers
                FROM Users";
            
            var usersDt = _dbHelper.ExecuteQuery(usersQuery);
            if (usersDt.Rows.Count > 0)
            {
                var row = usersDt.Rows[0];
                analytics.TotalUsers = Convert.ToInt32(row["TotalUsers"]);
                analytics.ActiveUsers = row["ActiveUsers"] == DBNull.Value ? 0 : Convert.ToInt32(row["ActiveUsers"]);
                analytics.InactiveUsers = row["InactiveUsers"] == DBNull.Value ? 0 : Convert.ToInt32(row["InactiveUsers"]);
            }

            // Total recipes
            var recipesQuery = "SELECT COUNT(*) FROM Recipes";
            analytics.TotalRecipes = Convert.ToInt32(_dbHelper.ExecuteScalar(recipesQuery));

            // Most viewed recipes
            var mostViewedQuery = @"
                SELECT r.*, u.FullName AS AuthorName, c.CategoryName,
                       COALESCE((SELECT AVG(rt.RatingValue) FROM Ratings rt WHERE rt.RecipeId = r.RecipeId), 0) AS AverageRating
                FROM Recipes r
                LEFT JOIN Users u ON r.UserId = u.UserId
                LEFT JOIN Categories c ON r.CategoryId = c.CategoryId
                ORDER BY r.Views DESC LIMIT 5";
            
            var mvDt = _dbHelper.ExecuteQuery(mostViewedQuery);
            foreach (DataRow row in mvDt.Rows)
            {
                analytics.MostViewedRecipes.Add(new Recipe
                {
                    RecipeId = Convert.ToInt32(row["RecipeId"]),
                    Title = row["Title"].ToString()!,
                    Ingredients = row["Ingredients"].ToString()!,
                    Steps = row["Steps"].ToString()!,
                    Views = row.Table.Columns.Contains("Views") && row["Views"] != DBNull.Value ? Convert.ToInt32(row["Views"]) : 0,
                    ImageUrl = row["ImageUrl"] == DBNull.Value ? null : row["ImageUrl"].ToString(),
                    CookingTime = row["CookingTime"] == DBNull.Value ? null : Convert.ToInt32(row["CookingTime"]),
                    Servings = row["Servings"] == DBNull.Value ? null : Convert.ToInt32(row["Servings"]),
                    UserId = Convert.ToInt32(row["UserId"]),
                    CategoryId = Convert.ToInt32(row["CategoryId"]),
                    AuthorName = row["AuthorName"]?.ToString() ?? "Unknown",
                    CategoryName = row["CategoryName"]?.ToString() ?? "Uncategorized",
                    AverageRating = row["AverageRating"] == DBNull.Value ? 0 : Convert.ToDouble(row["AverageRating"]),
                    CreatedAt = Convert.ToDateTime(row["CreatedAt"]),
                    UpdatedAt = Convert.ToDateTime(row["UpdatedAt"])
                });
            }

            // Daily Registrations (Last 7 days)
            var regStatsQuery = @"
                SELECT DATE(CreatedAt) as Date, COUNT(*) as Count 
                FROM Users 
                WHERE CreatedAt >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
                GROUP BY DATE(CreatedAt) 
                ORDER BY Date ASC";
            
            var regDt = _dbHelper.ExecuteQuery(regStatsQuery);
            foreach (DataRow row in regDt.Rows)
            {
                analytics.UserRegistrationStats.Add(new DateCountDto
                {
                    Date = Convert.ToDateTime(row["Date"]).ToString("yyyy-MM-dd"),
                    Count = Convert.ToInt32(row["Count"])
                });
            }

            // Daily Login Activity (Last 7 days)  
            var loginStatsQuery = @"
                SELECT DATE(LastLogin) as Date, COUNT(*) as Count 
                FROM Users 
                WHERE LastLogin >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
                GROUP BY DATE(LastLogin) 
                ORDER BY Date ASC";
                
            var loginDt = _dbHelper.ExecuteQuery(loginStatsQuery);
            foreach (DataRow row in loginDt.Rows)
            {
                analytics.LoginActivityStats.Add(new DateCountDto
                {
                    Date = Convert.ToDateTime(row["Date"]).ToString("yyyy-MM-dd"),
                    Count = Convert.ToInt32(row["Count"])
                });
            }

            return analytics;
        }
    }
}
