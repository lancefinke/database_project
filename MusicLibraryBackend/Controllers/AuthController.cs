using Microsoft.AspNetCore.Mvc;
using MusicLibraryBackend.Models;
using MusicLibraryBackend.Services;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using static System.Net.Mime.MediaTypeNames;
using Microsoft.AspNetCore.Http;

namespace MusicLibraryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly JwtService _jwtService;
    private readonly string _connectionString;

    public AuthController(IConfiguration configuration, JwtService jwtService)
    {
        _configuration = configuration;
        _jwtService = jwtService;
        _connectionString = _configuration.GetConnectionString("DatabaseConnection");
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        try
        {


            using (var connection = new SqlConnection(_connectionString))
                {
                await connection.OpenAsync();

                // Check if username already exists
                var checkUsernameCmd = new SqlCommand(
                    "SELECT COUNT(1) FROM Users WHERE Username = @Username",
                    connection);
                checkUsernameCmd.Parameters.AddWithValue("@Username", request.Username);
                var usernameExists = (int)await checkUsernameCmd.ExecuteScalarAsync() > 0;

                if (usernameExists)
                {
                    return BadRequest(new { message = "Username already exists" });
                }

                // Check if email already exists
                var checkEmailCmd = new SqlCommand(
                    "SELECT COUNT(1) FROM Users WHERE Email = @Email",
                    connection);
                checkEmailCmd.Parameters.AddWithValue("@Email", request.Email);
                var emailExists = (int)await checkEmailCmd.ExecuteScalarAsync() > 0;

                if (emailExists)
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                //Check if user is banned
                var checkIsBanned = new SqlCommand(
                    "SELECT COUNT(1) FROM USERS WHERE Username = @Username AND isDeactivated = 1",
                    connection);
                checkIsBanned.Parameters.AddWithValue("@Username", request.Username);
                var isBanned = (int)await checkIsBanned.ExecuteScalarAsync() > 0;

                if (isBanned)
                {
                    return BadRequest(new { message = "This account has been banned" });
                }

                // Hash password using SHA256 and take first 20 characters
                var hashedPassword = HashPassword(request.Password);

                // Insert new user
                var cmd = new SqlCommand(
                    @"INSERT INTO Users (Username, UserPassword, Email, IsArtist,ProfilePicture,Bio) 
                      VALUES (@Username, @Password, @Email, @IsArtist,@ProfilePicture,@Bio);
                      SELECT CAST(SCOPE_IDENTITY() as int)",
                    connection);

                cmd.Parameters.AddWithValue("@Username", request.Username);
                cmd.Parameters.AddWithValue("@Password", hashedPassword);
                cmd.Parameters.AddWithValue("@Email", request.Email);
                cmd.Parameters.AddWithValue("@IsArtist", request.IsArtist);
                cmd.Parameters.AddWithValue("@ProfilePicture", request.ProfilePicture);
                cmd.Parameters.AddWithValue("@Bio", request.Bio);

                var userId = (int)await cmd.ExecuteScalarAsync();

                return Ok(new
                {
                    message = "User registered successfully",
                    userId = userId
                });
            }
        
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error registering user", error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        try
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var cmd = new SqlCommand(
                    "SELECT UserID, Username, UserPassword, isArtist, isAdmin FROM Users WHERE Username = @Username",
                    connection);
                cmd.Parameters.AddWithValue("@Username", request.Username);

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        var storedHash = reader.GetString(2);
                        var hashedPassword = HashPassword(request.Password);

                        if (storedHash == hashedPassword)
                        {
                            var userId = reader.GetInt32(0);
                            var username = reader.GetString(1);
                            var isArtist = reader.GetBoolean(3);
                            var isAdmin = reader.GetBoolean(4);

                            var token = GenerateJwtToken(userId, username, isArtist, isAdmin);

                            return Ok(new
                            {
                                token,
                                isAdmin = isAdmin //
                            });
                        }
                    }
                }
            }

            return Unauthorized(new { message = "Invalid username or password" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error during login", error = ex.Message });
        }
    }


    private string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            // Take first 20 characters of the hash
            return Convert.ToBase64String(hashedBytes).Substring(0, 20);
        }
    }

    private string GenerateJwtToken(int userId, string username, bool isArtist, bool isAdmin)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
        new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
        new Claim(ClaimTypes.Name, username),
        new Claim("IsArtist", isArtist.ToString()),
        new Claim("IsAdmin", isAdmin.ToString()) //
    };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public class RegisterRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public bool IsArtist { get; set; }

        public string ProfilePicture { get; set; }

        public string Bio { get; set; }
    }

    public class LoginRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
} 