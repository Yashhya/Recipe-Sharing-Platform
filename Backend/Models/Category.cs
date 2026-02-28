// Condensed comment block.

namespace RecipeSharingAPI.Models
{
    /// <summary>
    public class Category
    {
        // Primary key - auto-generated
        public int CategoryId { get; set; }

        // Unique name of the category
        public string CategoryName { get; set; } = string.Empty;

        // Optional description explaining the category
        public string? Description { get; set; }

        // When the category was created
        public DateTime CreatedAt { get; set; }
    }
}
