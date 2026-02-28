// Condensed comment block.

namespace RecipeSharingAPI.Models
{
    /// <summary>
    public class Comment
    {
        // Primary key
        public int CommentId { get; set; }

        // Which recipe the comment belongs to
        public int RecipeId { get; set; }

        // Who wrote the comment
        public int UserId { get; set; }

        // The actual comment text
        public string CommentText { get; set; } = string.Empty;

        // Joined field from Users table - not stored in Comments table
        public string UserName { get; set; } = string.Empty;

        // When the comment was posted
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    public class CommentDto
    {
        public string CommentText { get; set; } = string.Empty;
    }
}
