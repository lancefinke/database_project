using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MusicLibraryBackend.Models;
using MusicLibraryBackend.Services;

using System.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MusicLibraryBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {

        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }
        // WORK IN PROGRESS 
        // GET: api/GetUSers
        // returns json body with all users and all the information (temp will change)
        [HttpGet]
        [Route("GetUsers")]
        public JsonResult GetUsersJson()
        {

            var users = _userService.GetAllUsers();
            return new JsonResult(users);

        }

        //returns 1 user with specific username
        [HttpGet]
        [Route("GetUserByName")]
        public JsonResult GetUserByName([FromQuery] string name)
        {
            var result = _userService.GetUserByName(name);
            return new JsonResult(result);

        }

        //retrive all followers of a specific user
        //[HttpGet]
        //[Route("GetFollowers")]
        //public JsonResult CreateUsers([FromQuery] int userID)
        //{
        //    var result = _userService.GetUserFollowers(userID);
        //    return new JsonResult(result);

        //}

        
        [HttpPost]
        [Route("CreateUsers")]
        [Consumes("multipart/form-data")]
        public Task<IActionResult> CreateUsers([FromForm] 
          //int newUserID, WILL BE ADDED LATER
          string newUserName,
         string newEmail,
         IFormFile newPictureURL,
         string newBio,
         string newPassword,
         //DateOnly newDateCreation, 
         bool role)
        {
            var result = _userService.CreateUser(
            newUserName,
            newEmail,
            newPictureURL,
            newBio,
            newPassword,
            role
            );
            return result;

        }

        [HttpPost]
        [Route("BanUser")]
        public IActionResult BanUser([FromBody] BanUserRequest request)
        {
            Console.WriteLine($"BanUser Request: ArtistID={request.ArtistID}, UserID={request.UserID}");

            try
            {
                bool result = _userService.BanUser(request);

                if (result)
                    return Ok(new { message = "User has been banned successfully." });

                return StatusCode(500, "Failed to ban user.");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }




        [HttpGet]
        [Route("GenerateUserReport")]
        public IActionResult GenerateUserReport()
        {
            // This should be a method that fetches all users
            List<User> users = _userService.GetAllUsers();
            List<BannedUser> bannedUsers = _userService.GetBannedUsers();
            var artists = users.Where(u => u.isArtist).ToList();
            var listeners = users.Where(u => !u.isArtist).ToList();
            

            Console.WriteLine("=== Artists ===");
            foreach (var user in artists)
            {
                Console.WriteLine($"Username: {user.Username}, Email: {user.Email}, CreatedAt: {user.CreatedAt}, IsArtist: {user.isArtist}");
            }

            Console.WriteLine("\n=== Listeners ===");
            foreach (var user in listeners)
            {
                Console.WriteLine($"Username: {user.Username}, Email: {user.Email}, CreatedAt: {user.CreatedAt}, IsArtist: {user.isArtist}");
            }

            Console.WriteLine("\n=== Banned Users ===");
            foreach (var user in bannedUsers)
            {
                Console.WriteLine($"Username: {user.Username}, Email: {user.Email}, CreatedAt: {user.CreatedAt}, IsArtist: {user.isArtist}, BannedAt: {user.BannedAt}");
            }

            var report = new
            {
                Artists = artists.Select(u => new {
                    u.Username,
                    u.Email,
                    u.CreatedAt,
                    u.isArtist,
                    u.StrikeCount,
                    u.ArtistID
                }),
                Listeners = listeners.Select(u => new {
                    u.Username,
                    u.Email,
                    u.CreatedAt,
                    u.isArtist,
                    u.UserID
                }),
                BannedUsers = bannedUsers.Select(u => new {
                    u.Username,
                    u.Email,
                    u.CreatedAt,
                    u.BannedAt,
                    Role = u.isArtist ? "Artist" : "Listener"
                })
            };

            return Ok(report);
        }

    }
}


