// Condensed comment block.

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeSharingAPI.Models;
using RecipeSharingAPI.Services;
using System.Security.Claims;

namespace RecipeSharingAPI.Controllers
{
    /// <summary>
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController : ControllerBase
    {
        private readonly RecipeService _recipeService;
        private readonly IWebHostEnvironment _env;

        public RecipeController(RecipeService recipeService, IWebHostEnvironment env)
        {
            _recipeService = recipeService;
            _env = env;
        }

        /// <summary>
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        /// <summary>
        [HttpGet]
        [ResponseCache(Duration = 60, Location = ResponseCacheLocation.Any, NoStore = false)]
        public IActionResult GetAll()
        {
            try
            {
                var recipes = _recipeService.GetAllRecipes();
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve recipes", error = ex.Message });
            }
        }

        /// <summary>
        [HttpGet("{id}")]
        [ResponseCache(Duration = 30, Location = ResponseCacheLocation.Any, NoStore = false)]
        public IActionResult GetById(int id)
        {
            try
            {
                var recipe = _recipeService.GetRecipeById(id);
                if (recipe == null)
                    return NotFound(new { message = "Recipe not found" });
                return Ok(recipe);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve recipe", error = ex.Message });
            }
        }

        /// <summary>
        [HttpGet("user/{userId}")]
        public IActionResult GetByUser(int userId)
        {
            try
            {
                var recipes = _recipeService.GetRecipesByUser(userId);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve user recipes", error = ex.Message });
            }
        }

        /// <summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromForm] RecipeDto dto)
        {
            try
            {
                if (dto.ImageFile != null && dto.ImageFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "images");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImageFile.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.ImageFile.CopyToAsync(stream);
                    }

                    // For production, use dynamic domain. Hardcoding for localhost explicitly mapping to backend port
                    dto.ImageUrl = "http://localhost:5147/images/" + fileName;
                }

                var userId = GetUserId();
                var recipe = _recipeService.CreateRecipe(dto, userId);
                if (recipe == null)
                    return BadRequest(new { message = "Failed to create recipe" });

                return CreatedAtAction(nameof(GetById), new { id = recipe.RecipeId }, recipe);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to create recipe", error = ex.Message });
            }
        }

        /// <summary>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromForm] RecipeDto dto)
        {
            try
            {
                if (dto.ImageFile != null && dto.ImageFile.Length > 0)
                {
                    var uploadsFolder = Path.Combine(_env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"), "images");
                    if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                    var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImageFile.FileName);
                    var filePath = Path.Combine(uploadsFolder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await dto.ImageFile.CopyToAsync(stream);
                    }

                    dto.ImageUrl = "http://localhost:5147/images/" + fileName;
                }

                var userId = GetUserId();
                var recipe = _recipeService.UpdateRecipe(id, dto, userId);
                if (recipe == null)
                    return NotFound(new { message = "Recipe not found or you don't have permission to edit it" });
                return Ok(recipe);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update recipe", error = ex.Message });
            }
        }

        /// <summary>
        [HttpDelete("{id}")]
        [Authorize]
        public IActionResult Delete(int id)
        {
            try
            {
                var userId = GetUserId();
                var success = _recipeService.DeleteRecipe(id, userId);
                if (!success)
                    return NotFound(new { message = "Recipe not found or you don't have permission to delete it" });

                // 204 No Content is the standard response for successful DELETE
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to delete recipe", error = ex.Message });
            }
        }

        /// <summary>
        [HttpGet("search/title")]
        public IActionResult SearchByTitle([FromQuery] string query)
        {
            try
            {
                var recipes = _recipeService.SearchByTitle(query);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Search failed", error = ex.Message });
            }
        }

        /// <summary>
        [HttpGet("search/ingredients")]
        public IActionResult SearchByIngredients([FromQuery] string query)
        {
            try
            {
                var recipes = _recipeService.SearchByIngredients(query);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Search failed", error = ex.Message });
            }
        }

        /// <summary>
        [HttpGet("search/category/{categoryId}")]
        public IActionResult SearchByCategory(int categoryId)
        {
            try
            {
                var recipes = _recipeService.SearchByCategory(categoryId);
                return Ok(recipes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Search failed", error = ex.Message });
            }
        }
    }
}
