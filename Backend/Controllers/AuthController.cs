// Condensed comment block.

using Microsoft.AspNetCore.Mvc;
using RecipeSharingAPI.Models;
using RecipeSharingAPI.Services;

namespace RecipeSharingAPI.Controllers
{
    /// <summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        /// <summary>
        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            try
            {
                var result = _authService.Register(dto);
                if (result == null)
                {
                    // Email already exists - 409 Conflict is the appropriate status code
                    return Conflict(new { message = "Email already registered" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                // Log the exception in production
                // Never expose internal error details to the client
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        /// <summary>
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            try
            {
                var result = _authService.Login(dto);
                if (result == null)
                {
                    // Generic message prevents email enumeration attacks
                    return Unauthorized(new { message = "Invalid email or password" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }
    }
}
