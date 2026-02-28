// Condensed comment block.

using RecipeSharingAPI.Data;
using RecipeSharingAPI.Models;
using MySql.Data.MySqlClient;
using System.Data;

namespace RecipeSharingAPI.Services
{
    /// <summary>
    public class CommentService
    {
        private readonly DbHelper _dbHelper;

        public CommentService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        /// <summary>
        public List<Comment> GetCommentsByRecipe(int recipeId)
        {
            var query = @"
                SELECT co.*, u.FullName AS UserName 
                FROM Comments co
                JOIN Users u ON co.UserId = u.UserId
                WHERE co.RecipeId = @RecipeId
                ORDER BY co.CreatedAt DESC";

            var parameters = new[] {
                new MySqlParameter("@RecipeId", recipeId)
            };

            var dt = _dbHelper.ExecuteQuery(query, parameters);

            var comments = new List<Comment>();
            foreach (DataRow row in dt.Rows)
            {
                comments.Add(new Comment
                {
                    CommentId = Convert.ToInt32(row["CommentId"]),
                    RecipeId = Convert.ToInt32(row["RecipeId"]),
                    UserId = Convert.ToInt32(row["UserId"]),
                    CommentText = row["CommentText"].ToString()!,
                    UserName = row["UserName"].ToString()!,
                    CreatedAt = Convert.ToDateTime(row["CreatedAt"])
                });
            }
            return comments;
        }

        /// <summary>
        public Comment? AddComment(int recipeId, int userId, string commentText)
        {
            var query = @"INSERT INTO Comments (RecipeId, UserId, CommentText) 
                          VALUES (@RecipeId, @UserId, @CommentText);
                          SELECT LAST_INSERT_ID();";

            var parameters = new[] {
                new MySqlParameter("@RecipeId", recipeId),
                new MySqlParameter("@UserId", userId),
                new MySqlParameter("@CommentText", commentText)
            };

            var result = _dbHelper.ExecuteScalar(query, parameters);
            var newId = Convert.ToInt32(result);

            // Retrieve the full comment with joined user name
            var getQuery = @"
                SELECT co.*, u.FullName AS UserName 
                FROM Comments co
                JOIN Users u ON co.UserId = u.UserId
                WHERE co.CommentId = @CommentId";

            var getParams = new[] {
                new MySqlParameter("@CommentId", newId)
            };

            var dt = _dbHelper.ExecuteQuery(getQuery, getParams);
            if (dt.Rows.Count == 0) return null;

            var row = dt.Rows[0];
            return new Comment
            {
                CommentId = Convert.ToInt32(row["CommentId"]),
                RecipeId = Convert.ToInt32(row["RecipeId"]),
                UserId = Convert.ToInt32(row["UserId"]),
                CommentText = row["CommentText"].ToString()!,
                UserName = row["UserName"].ToString()!,
                CreatedAt = Convert.ToDateTime(row["CreatedAt"])
            };
        }
    }
}
