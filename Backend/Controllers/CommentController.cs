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
    public class CommentController : ControllerBase
    {
        private readonly CommentService _commentService;

        public CommentController(CommentService commentService)
        {
            _commentService = commentService;
        }

        /// <summary>
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        /// <summary>
        [HttpGet("{recipeId}")]
        public IActionResult GetByRecipe(int recipeId)
        {
            try
            {
                var comments = _commentService.GetCommentsByRecipe(recipeId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to retrieve comments", error = ex.Message });
            }
        }

        /// <summary>
        [HttpPost("{recipeId}")]
        [Authorize]
        public IActionResult AddComment(int recipeId, [FromBody] CommentDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.CommentText))
                    return BadRequest(new { message = "Comment text is required" });

                var userId = GetUserId();
                var comment = _commentService.AddComment(recipeId, userId, dto.CommentText);

                if (comment == null)
                    return BadRequest(new { message = "Failed to add comment" });

                return CreatedAtAction(nameof(GetByRecipe), new { recipeId }, comment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to add comment", error = ex.Message });
            }
        }
    }
}
