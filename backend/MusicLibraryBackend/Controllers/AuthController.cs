using Microsoft.AspNetCore.Mvc;
using MusicLibraryBackend.Models;
using MusicLibraryBackend.Services;
using Microsoft.Data.SqlClient;
using System.Data;

namespace MusicLibraryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly JwtService _jwtService;

    public AuthController(IConfiguration configuration, JwtService jwtService)
    {
        _configuration = configuration;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        await connection.OpenAsync();

        // Check if username already exists
        using var checkCommand = new SqlCommand(
            "SELECT COUNT(*) FROM Users WHERE Username = @Username",
            connection);
        checkCommand.Parameters.AddWithValue("@Username", request.Username);
        
        var exists = (int)await checkCommand.ExecuteScalarAsync() > 0;
        if (exists)
        {
            return BadRequest("Username already exists");
        }

        // Hash password
        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        // Insert new user
        using var command = new SqlCommand(
            @"INSERT INTO Users (Username, PasswordHash, Email, Role, CreatedAt) 
              OUTPUT INSERTED.Id
              VALUES (@Username, @PasswordHash, @Email, @Role, @CreatedAt)",
            connection);

        command.Parameters.AddWithValue("@Username", request.Username);
        command.Parameters.AddWithValue("@PasswordHash", passwordHash);
        command.Parameters.AddWithValue("@Email", request.Email);
        command.Parameters.AddWithValue("@Role", request.Role.ToString());
        command.Parameters.AddWithValue("@CreatedAt", DateTime.UtcNow);

        var userId = (int)await command.ExecuteScalarAsync();

        var user = new User
        {
            Id = userId,
            Username = request.Username,
            Email = request.Email,
            Role = request.Role
        };

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Username = user.Username,
            Role = user.Role,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        using var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));
        await connection.OpenAsync();

        using var command = new SqlCommand(
            "SELECT Id, Username, PasswordHash, Email, Role FROM Users WHERE Username = @Username",
            connection);
        command.Parameters.AddWithValue("@Username", request.Username);

        using var reader = await command.ExecuteReaderAsync();
        if (!await reader.ReadAsync())
        {
            return BadRequest("Invalid username or password");
        }

        var user = new User
        {
            Id = reader.GetInt32(0),
            Username = reader.GetString(1),
            PasswordHash = reader.GetString(2),
            Email = reader.GetString(3),
            Role = Enum.Parse<UserRole>(reader.GetString(4))
        };

        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            return BadRequest("Invalid username or password");
        }

        // Update last login
        await reader.CloseAsync();
        using var updateCommand = new SqlCommand(
            "UPDATE Users SET LastLoginAt = @LastLoginAt WHERE Id = @Id",
            connection);
        updateCommand.Parameters.AddWithValue("@LastLoginAt", DateTime.UtcNow);
        updateCommand.Parameters.AddWithValue("@Id", user.Id);
        await updateCommand.ExecuteNonQueryAsync();

        var token = _jwtService.GenerateToken(user);

        return new AuthResponse
        {
            Token = token,
            Username = user.Username,
            Role = user.Role,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        };
    }
} 