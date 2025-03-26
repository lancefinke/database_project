using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace MusicLibraryBackend.Models;

public class LoginRequest
{
    [Required]
    [DefaultValue("johndoe")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [DefaultValue("YourPassword123!")]
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    [Required]
    [DefaultValue("johndoe")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [DefaultValue("YourPassword123!")]
    public string Password { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [DefaultValue("john.doe@example.com")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [DefaultValue(false)]
    public bool isArtist { get; set; }
}

public class AuthResponse
{
    public string Token { get; set; } = string.Empty;

    [DefaultValue("johndoe")]
    public string Username { get; set; } = string.Empty;

    [DefaultValue("Listener")]
    public string Role { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }
} 