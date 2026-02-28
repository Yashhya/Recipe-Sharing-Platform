// Condensed comment block.

using RecipeSharingAPI.Data;
using RecipeSharingAPI.Models;
using MySql.Data.MySqlClient;
using System.Data;

namespace RecipeSharingAPI.Services
{
    /// <summary>
    public class CategoryService
    {
        private readonly DbHelper _dbHelper;

        public CategoryService(DbHelper dbHelper)
        {
            _dbHelper = dbHelper;
        }

        /// <summary>
        public List<Category> GetAllCategories()
        {
            var query = "SELECT * FROM Categories ORDER BY CategoryName";
            var dt = _dbHelper.ExecuteQuery(query);

            var categories = new List<Category>();
            foreach (DataRow row in dt.Rows)
            {
                categories.Add(new Category
                {
                    CategoryId = Convert.ToInt32(row["CategoryId"]),
                    CategoryName = row["CategoryName"].ToString()!,
                    Description = row["Description"] == DBNull.Value ? null : row["Description"].ToString(),
                    CreatedAt = Convert.ToDateTime(row["CreatedAt"])
                });
            }
            return categories;
        }

        /// <summary>
        public Category? GetCategoryById(int id)
        {
            var query = "SELECT * FROM Categories WHERE CategoryId = @CategoryId";
            var parameters = new[] {
                new MySqlParameter("@CategoryId", id)
            };

            var dt = _dbHelper.ExecuteQuery(query, parameters);
            if (dt.Rows.Count == 0) return null;

            var row = dt.Rows[0];
            return new Category
            {
                CategoryId = Convert.ToInt32(row["CategoryId"]),
                CategoryName = row["CategoryName"].ToString()!,
                Description = row["Description"] == DBNull.Value ? null : row["Description"].ToString(),
                CreatedAt = Convert.ToDateTime(row["CreatedAt"])
            };
        }
    }
}
