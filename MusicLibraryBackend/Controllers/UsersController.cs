using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
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
        [HttpGet]
        [Route("GetFollowers")]
        public JsonResult CreateUsers([FromQuery] int userID)
        {
            var result = _userService.GetUserFollowers(userID);
            return new JsonResult(result);

        }

        // WORK IN PROGRESS
        // POST api/CreateUsers
        // Sends all data from create new users page to the database
        [HttpPost]
        [Route("CreateUsers")]
        public JsonResult CreateUsers([FromForm] 
          //int newUserID, WILL BE ADDED LATER
          string newUserName,
          string newEmail,
          string newPictureURL,
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
            return new JsonResult(result);

        }

        [HttpPost]
        [Route("banUser")]
        public JsonResult BanUser([FromForm] 
          //int newUserID, WILL BE ADDED LATER
          int userID,
          string userName,
          string email,
          string reason)
        {
            var result = _userService.BanUser(
            userID,
            userName,
            email,
            reason
            );
            return new JsonResult(result);

        }


        [HttpGet]
        [Route("GenerateUserReport")]
        public IActionResult GenerateUserReport()
        {
            // This should be a method that fetches all users
            List<User> users = _userService.GetAllUsers();

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

            List<BannedUser> bannedUsers = _userService.GetBannedUsers();

            Console.WriteLine("\n=== Banned Users ===");
            foreach (var user in bannedUsers)
            {
                Console.WriteLine($"Username: {user.Username}, Email: {user.Email}, CreatedAt: {user.CreatedAt}, IsArtist: {user.isArtist}, BanReason: {user.BanReason}, DateBanned: {user.DateBanned}");
            }

            var report = new
            {
                Artists = artists.Select(u => new {
                    u.Username,
                    u.Email,
                    u.CreatedAt,
                    u.isArtist
                }),
                Listeners = listeners.Select(u => new {
                    u.Username,
                    u.Email,
                    u.CreatedAt,
                    u.isArtist
                }),
                BannedUsers = bannedUsers.Select(u => new {
                    u.Username,
                    u.Email,
                    u.BanReason,
                    u.DateBanned
                })
            };

            return Ok(report);
        }

    }
}


