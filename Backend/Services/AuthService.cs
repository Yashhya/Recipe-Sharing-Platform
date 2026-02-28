// Condensed comment block.

using RecipeSharingAPI.Data;
using RecipeSharingAPI.Models;
using MySql.Data.MySqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace RecipeSharingAPI.Services
{
    /// <summary>
    public class AuthService
    {
        private readonly DbHelper _dbHelper;
        private readonly IConfiguration _configuration;

        /// <summary>
        public AuthService(DbHelper dbHelper, IConfiguration configuration)
        {
            _dbHelper = dbHelper;
            _configuration = configuration;
        }

        /// <summary>
        public AuthResponse? Register(RegisterDto dto)
        {
            // Step 1: Check if email already exists
            var checkQuery = "SELECT COUNT(*) FROM Users WHERE Email = @Email";
            var checkParams = new[] {
                new MySqlParameter("@Email", dto.Email)
            };
            var existingCount = Convert.ToInt32(_dbHelper.ExecuteScalar(checkQuery, checkParams));

            if (existingCount > 0)
            {
                // Email already registered - return null to indicate failure
                return null;
            }

            // Step 2: Hash the password using BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // Step 3: Insert new user with parameterized query (prevents SQL injection)
            var insertQuery = @"INSERT INTO Users (FullName, Email, PasswordHash) 
                               VALUES (@FullName, @Email, @PasswordHash)";
            var insertParams = new[] {
                new MySqlParameter("@FullName", dto.FullName),
                new MySqlParameter("@Email", dto.Email),
                new MySqlParameter("@PasswordHash", passwordHash)
            };
            _dbHelper.ExecuteNonQuery(insertQuery, insertParams);

            // Step 4: Retrieve the newly created user to get their UserId
            var user = GetUserByEmail(dto.Email);
            if (user == null) return null;

            // Step 5: Generate JWT token and return auth response
            return new AuthResponse
            {
                Token = GenerateJwtToken(user),
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            };
        }

        /// <summary>
        public AuthResponse? Login(LoginDto dto)
        {
            // Step 1: Find the user by email
            var user = GetUserByEmail(dto.Email);
            if (user == null) return null;

            // Step 2: Verify password against stored hash
            bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);
            if (!isValid) return null;

            // Step 2.5: Update LastLogin
            var updateQuery = "UPDATE Users SET LastLogin = NOW() WHERE Email = @Email";
            var updateParams = new[] { new MySqlParameter("@Email", dto.Email) };
            _dbHelper.ExecuteNonQuery(updateQuery, updateParams);

            // Step 3: Generate JWT token for authenticated user
            return new AuthResponse
            {
                Token = GenerateJwtToken(user),
                UserId = user.UserId,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role
            };
        }

        /// <summary>
        private User? GetUserByEmail(string email)
        {
            var query = "SELECT * FROM Users WHERE Email = @Email";
            var parameters = new[] {
                new MySqlParameter("@Email", email)
            };
            var dt = _dbHelper.ExecuteQuery(query, parameters);

            if (dt.Rows.Count == 0) return null;

            var row = dt.Rows[0];
            return new User
            {
                UserId = Convert.ToInt32(row["UserId"]),
                FullName = row["FullName"].ToString()!,
                Email = row["Email"].ToString()!,
                PasswordHash = row["PasswordHash"].ToString()!,
                Role = row["Role"]?.ToString() ?? "User",
                CreatedAt = Convert.ToDateTime(row["CreatedAt"]),
                LastLogin = row["LastLogin"] != DBNull.Value ? Convert.ToDateTime(row["LastLogin"]) : null
            };
        }

        /// <summary>
        private string GenerateJwtToken(User user)
        {
            // Get the secret key from configuration
            var jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("JWT Key not configured");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

            // Create signing credentials using HMAC-SHA256 algorithm
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Define claims - these are the data stored in the token
            // Claims are accessible in controllers to identify the logged-in user
            var claims = new[]
            {
                // Standard JWT claim for user identifier
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                // Standard JWT claim for email
                new Claim(ClaimTypes.Email, user.Email),
                // Standard JWT claim for display name
                new Claim(ClaimTypes.Name, user.FullName),
                // Standard JWT claim for role authorization
                new Claim(ClaimTypes.Role, user.Role)
            };

            // Create the token with all components
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7), // Token valid for 7 days
                signingCredentials: creds
            );

            // Serialize token to a string
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
