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
    public class RatingController : ControllerBase
    {
        private readonly RatingService _ratingService;

        public RatingController(RatingService ratingService)
        {
            _ratingService = ratingService;
        }

        /// <summary>
        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? int.Parse(userIdClaim.Value) : 0;
        }

        /// <summary>
        [HttpPost("{recipeId}")]
        [Authorize]
        public IActionResult Rate(int recipeId, [FromBody] RatingDto dto)
        {
            try
            {
                // Validate rating range (1-5)
                if (dto.RatingValue < 1 || dto.RatingValue > 5)
                    return BadRequest(new { message = "Rating must be between 1 and 5" });

                var userId = GetUserId();
                var success = _ratingService.AddOrUpdateRating(recipeId, userId, dto.RatingValue);

                if (!success)
                    return BadRequest(new { message = "Failed to submit rating" });

                // Return the new average rating after this submission
                var average = _ratingService.GetAverageRating(recipeId);
                return Ok(new { message = "Rating submitted successfully", averageRating = average });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to submit rating", error = ex.Message });
            }
        }

        /// <summary>
        [HttpGet("{recipeId}/average")]
        public IActionResult GetAverage(int recipeId)
        {
            try
            {
                var average = _ratingService.GetAverageRating(recipeId);
                return Ok(new { averageRating = average });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to get average rating", error = ex.Message });
            }
        }

        /// <summary>
        [HttpGet("{recipeId}/user")]
        [Authorize]
        public IActionResult GetUserRating(int recipeId)
        {
            try
            {
                var userId = GetUserId();
                var rating = _ratingService.GetUserRating(recipeId, userId);
                return Ok(new { ratingValue = rating });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to get user rating", error = ex.Message });
            }
        }
    }
}
