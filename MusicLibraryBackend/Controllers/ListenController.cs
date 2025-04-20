using Microsoft.AspNetCore.Mvc;
using MusicLibraryBackend.Models;
using MusicLibraryBackend.Services;

namespace MusicLibraryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListenController : ControllerBase
    {
        private readonly ListenService _listenService;

        public ListenController(IConfiguration config)
        {
            _listenService = new ListenService(config);
        }

        [HttpPost("AddListen")]
        public IActionResult AddListen([FromBody] ListenRequest request)
        {
            if (request == null || request.UserID <= 0 || request.SongID <= 0)
                return BadRequest("Invalid request data.");

            bool success = _listenService.AddListen(request);

            if (success)
                return Ok(new { message = "Listen recorded successfully." });
            else
                return Conflict("Listen already recorded or an error occurred.");
        }
    }
}
