using Microsoft.AspNetCore.Mvc;
using MusicLibraryBackend.Models;
using MusicLibraryBackend.Services;

namespace MusicLibraryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RatingsController : ControllerBase
    {
        private readonly RatingService _ratingService;

        public RatingsController(RatingService ratingService)
        {
            _ratingService = ratingService;
        }

        [HttpPost]
        [Route("PostRating")]
        public IActionResult PostRating([FromBody] RatingRequest request)
        {
            if (request.Rating < 1 || request.Rating > 5)
                return BadRequest("Rating must be between 1 and 5");

            var response = _ratingService.SubmitRating(request);
            return Ok(response);
        }
    }
}