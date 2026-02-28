// Condensed comment block.

namespace RecipeSharingAPI.Models
{
    /// <summary>
    public class Rating
    {
        // Primary key
        public int RatingId { get; set; }

        // Which recipe is being rated
        public int RecipeId { get; set; }

        // Who is rating (the logged-in user)
        public int UserId { get; set; }

        // Rating value: 1 (worst) to 5 (best)
        // CHECK constraint in DB ensures this range
        public int RatingValue { get; set; }

        // When the rating was submitted
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    public class RatingDto
    {
        // Value between 1-5 inclusive
        public int RatingValue { get; set; }
    }
}
