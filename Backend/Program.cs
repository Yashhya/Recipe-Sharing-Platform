// Condensed comment block.

using RecipeSharingAPI.Data;
using RecipeSharingAPI.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "RecipeSharingAPI", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your valid token."
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddSingleton<DbHelper>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<RecipeService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<RatingService>();
builder.Services.AddScoped<CommentService>();
builder.Services.AddScoped<AdminService>(); // newly added Admin service

// CORS Policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key not configured in appsettings.json");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // Validate the token's signature using our secret key
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            // Validate that the token was issued by our API
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            // Validate that the token is intended for our frontend
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            // Validate that the token hasn't expired
            ValidateLifetime = true
        };
    });

var app = builder.Build();

// Enable Swagger UI for API testing and management
app.UseSwagger();
app.UseSwaggerUI();

// Apply CORS policy BEFORE authentication
// This ensures preflight OPTIONS requests are handled correctly
app.UseCors("AllowAngular");

// Allow serving static files (uploaded images)
app.UseStaticFiles();

// Authentication must come BEFORE Authorization
// UseAuthentication: Validates JWT tokens (sets HttpContext.User)
app.UseAuthentication();

// UseAuthorization: Checks [Authorize] attributes on controllers
app.UseAuthorization();

// Map controller routes (e.g., /api/recipe → RecipeController)
app.MapControllers();

// Start the application
app.Run();
