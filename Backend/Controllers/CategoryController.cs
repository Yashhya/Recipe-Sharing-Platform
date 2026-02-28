// Condensed comment block.

using Microsoft.AspNetCore.Mvc;
using RecipeSharingAPI.Services;

namespace RecipeSharingAPI.Controllers
{
    /// <summary>
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoryController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// <summary>
        [HttpGet]
        [ResponseCache(Duration = 600, Location = ResponseCacheLocation.Any)]
        public IActionResult GetAll()
        {
            try
            {
                var categories = _categoryService.GetAllCategories();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve categories", error = ex.Message });
            }
        }

        /// <summary>
        [HttpGet("{id}")]
        [ResponseCache(Duration = 600, Location = ResponseCacheLocation.Any)]
        public IActionResult GetById(int id)
        {
            try
            {
                var category = _categoryService.GetCategoryById(id);
                if (category == null)
                    return NotFound(new { message = "Category not found" });
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve category", error = ex.Message });
            }
        }
    }
}
