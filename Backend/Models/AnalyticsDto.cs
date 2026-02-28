namespace RecipeSharingAPI.Models
{
    public class DateCountDto
    {
        public string Date { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class AnalyticsDto
    {
        public int TotalUsers { get; set; }
        public int TotalRecipes { get; set; }
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        
        public List<Recipe> MostViewedRecipes { get; set; } = new List<Recipe>();
        
        public List<DateCountDto> UserRegistrationStats { get; set; } = new List<DateCountDto>();
        public List<DateCountDto> RecipeCreationStats { get; set; } = new List<DateCountDto>();
        public List<DateCountDto> LoginActivityStats { get; set; } = new List<DateCountDto>();
    }
}
