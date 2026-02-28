using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeSharingAPI.Services;

namespace RecipeSharingAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // Requires both a valid token AND the 'Admin' role claim
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AdminService _adminService;
        private readonly RecipeService _recipeService;

        public AdminController(AdminService adminService, RecipeService recipeService)
        {
            _adminService = adminService;
            _recipeService = recipeService;
        }

        [HttpGet("users")]
        public IActionResult GetAllUsers()
        {
            var users = _adminService.GetAllUsers();
            return Ok(users);
        }

        [HttpGet("analytics")]
        public IActionResult GetAnalytics()
        {
            var analytics = _adminService.GetAnalytics();
            return Ok(analytics);
        }

        [HttpDelete("user/{id}")]
        public IActionResult DeleteUser(int id)
        {
            var result = _adminService.DeleteUser(id);
            if (!result) return NotFound(new { message = "User not found" });
            return NoContent();
        }

        [HttpGet("recipes")]
        public IActionResult GetAllRecipes()
        {
            // Re-using the get all recipes from RecipeService
            var recipes = _recipeService.GetAllRecipes();
            return Ok(recipes);
        }

        [HttpDelete("recipe/{id}")]
        public IActionResult DeleteRecipe(int id)
        {
            var result = _adminService.DeleteRecipe(id);
            if (!result) return NotFound(new { message = "Recipe not found" });
            return NoContent();
        }
    }
}
