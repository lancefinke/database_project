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
        // configuration for connection strings
        // WILL BE REFORMATED LATER
        //private IConfiguration _configuration;
        //public UsersController(IConfiguration configuration)
        //{
        //    _configuration = configuration;
        //}
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

            //OLD STUFF KEEPING JUST IN CASE
            //string query = "select * from dbo.USERS";
            //// puts all data into a table
            //DataTable table = new DataTable();
            //// access the database
            //string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");
            //SqlDataReader myReader;
            //// creates the connection
            //using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            //{
            //    myCon.Open();
            //    // queries the database
            //    using (SqlCommand myCommand = new SqlCommand(query, myCon))
            //    {
            //        // parses the query results and puts them into the table
            //        myReader = myCommand.ExecuteReader();
            //        table.Load(myReader);
            //        myReader.Close();
            //        myCon.Close();
            //    }
            //}
            //// return the result as a json body
            //return new JsonResult(table);
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

        //{
        //    string query = "insert into dbo.USERS(Username, Email, ProfilePicture, Bio, UserPassword, CreatedAt, isArtist) values(@newUserName,@newEmail,@newPictureURL,@newBio,@newPassword,@newDateCreation,@role)";

        //    DataTable table = new DataTable();
        //    string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");

        //    SqlDataReader myReader;
        //    using (SqlConnection myCon = new SqlConnection(sqlDatasource))

        //    {
        //        myCon.Open();
        //        using (SqlCommand myCommand = new SqlCommand(query, myCon))
        //        {
        //            // gets current date instead of having to input 
        //            DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);
        //            // myCommand.Parameters.AddWithValue("@newUserID", newUserID);
        //            // parameters for the queries
        //            myCommand.Parameters.AddWithValue("@newUserName", newUserName);
        //            myCommand.Parameters.AddWithValue("@newEmail", newEmail);
        //            myCommand.Parameters.AddWithValue("@newPictureURL", newPictureURL);
        //            myCommand.Parameters.AddWithValue("@newBio", newBio);
        //            myCommand.Parameters.AddWithValue("@newPassword", newPassword);
        //            myCommand.Parameters.AddWithValue("@newDateCreation", currentDate.ToDateTime(TimeOnly.MinValue));
        //            myCommand.Parameters.AddWithValue("@role", role);

        //            // parses data and uploads to database
        //            myReader = myCommand.ExecuteReader();
        //            table.Load(myReader);
        //            myReader.Close();
        //            myCon.Close();
        //        }
        //    }
        //    // if result ok then it gets submitted to the database
        //    return new JsonResult("Added Succesfully");

        

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
                })
            };

            return Ok(report);
        }

    }
}
