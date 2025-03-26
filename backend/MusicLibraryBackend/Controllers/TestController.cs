using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MusicLibraryBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet("public")]
    public IActionResult PublicEndpoint()
    {
        return Ok(new { message = "This is a public endpoint" });
    }

    [Authorize]
    [HttpGet("protected")]
    public IActionResult ProtectedEndpoint()
    {
        return Ok(new { message = "This is a protected endpoint", user = User.Identity?.Name });
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public IActionResult AdminEndpoint()
    {
        return Ok(new { message = "This is an admin-only endpoint", user = User.Identity?.Name });
    }

    [Authorize(Roles = "Artist")]
    [HttpGet("artist")]
    public IActionResult ArtistEndpoint()
    {
        return Ok(new { message = "This is an artist-only endpoint", user = User.Identity?.Name });
    }
} 