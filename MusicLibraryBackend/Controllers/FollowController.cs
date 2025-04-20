using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

using System.Data;
using Microsoft.Data.SqlClient;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MusicLibraryBackend.Models;

namespace MusicLibraryBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FollowController : Controller
    {


        private readonly IConfiguration _configuration;

        public FollowController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("AddFollow")]
        public IActionResult AddFollow([FromBody] FollowRequest request)
        {
            var connectionString = _configuration.GetConnectionString("DatabaseConnection");

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string checkQuery = "SELECT COUNT(*) FROM Followers WHERE UserID = @UserID AND ArtistID = @ArtistID";
                using (SqlCommand checkCmd = new SqlCommand(checkQuery, con))
                {
                    checkCmd.Parameters.AddWithValue("@UserID", request.UserID);
                    checkCmd.Parameters.AddWithValue("@ArtistID", request.ArtistID);
                    int count = (int)checkCmd.ExecuteScalar();
                    if (count > 0)
                        return BadRequest("User already follows this artist.");
                }

                string insertQuery = "INSERT INTO Followers (UserID, ArtistID) VALUES (@UserID, @ArtistID)";
                using (SqlCommand cmd = new SqlCommand(insertQuery, con))
                {
                    cmd.Parameters.AddWithValue("@UserID", request.UserID);
                    cmd.Parameters.AddWithValue("@ArtistID", request.ArtistID);
                    cmd.ExecuteNonQuery();
                }

                string updateFollowers = @"
                UPDATE Artists
                SET Followers = (
                    SELECT COUNT(*) FROM Followers WHERE ArtistID = @ArtistID
                )
                WHERE ArtistID = @ArtistID";
                using (SqlCommand updateCmd = new SqlCommand(updateFollowers, con))
                {
                    updateCmd.Parameters.AddWithValue("@ArtistID", request.ArtistID);
                    updateCmd.ExecuteNonQuery();
                }

                return Ok("Follow added successfully.");
            }
        }

        // POST: api/Follow/Unfollow
        [HttpPost("Unfollow")]
        public IActionResult Unfollow([FromBody] FollowRequest request)
        {
            var connectionString = _configuration.GetConnectionString("DatabaseConnection");

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string deleteQuery = "DELETE FROM Followers WHERE UserID = @UserID AND ArtistID = @ArtistID";
                using (SqlCommand cmd = new SqlCommand(deleteQuery, con))
                {
                    cmd.Parameters.AddWithValue("@UserID", request.UserID);
                    cmd.Parameters.AddWithValue("@ArtistID", request.ArtistID);
                    int rows = cmd.ExecuteNonQuery();

                    if (rows == 0)
                        return NotFound("Follow relationship not found.");
                }

                string updateQuery = @"
                UPDATE Artists
                SET Followers = (
                    SELECT COUNT(*) FROM Followers WHERE ArtistID = @ArtistID
                )
                WHERE ArtistID = @ArtistID";
                using (SqlCommand cmd = new SqlCommand(updateQuery, con))
                {
                    cmd.Parameters.AddWithValue("@ArtistID", request.ArtistID);
                    cmd.ExecuteNonQuery();
                }

                return Ok("Unfollow successful.");
            }
        }

        // GET: api/Follow/GetArtistFollowStats?artistId=5
        [HttpGet("GetArtistFollowStats")]
        public IActionResult GetArtistFollowStats(int artistId)
        {
            var connectionString = _configuration.GetConnectionString("DatabaseConnection");
            var followers = new List<object>();

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string query = @"
                SELECT u.UserID, u.Username
                FROM Followers f
                JOIN Users u ON f.UserID = u.UserID
                WHERE f.ArtistID = @ArtistID";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@ArtistID", artistId);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            followers.Add(new
                            {
                                UserID = (int)reader["UserID"],
                                Username = reader["Username"].ToString()
                            });
                        }
                    }
                }
            }

            return Ok(new
            {
                ArtistID = artistId,
                FollowerCount = followers.Count,
                Followers = followers
            });
        }

        // GET: api/Follow/GetUserFollowStats?userId=10
        [HttpGet("GetUserFollowStats")]
        public IActionResult GetUserFollowStats(int userId)
        {
            var connectionString = _configuration.GetConnectionString("DatabaseConnection");
            var followingArtists = new List<object>();

            using (SqlConnection con = new SqlConnection(connectionString))
            {
                con.Open();

                string query = @"
            SELECT 
                a.ArtistID, 
                u.Username AS ArtistName,
                a.Followers
            FROM Followers f
            JOIN Artists a ON f.ArtistID = a.ArtistID
            JOIN Users u ON a.UserID = u.UserID
            WHERE f.UserID = @UserID";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@UserID", userId);

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            followingArtists.Add(new
                            {
                                ArtistID = (int)reader["ArtistID"],
                                ArtistName = reader["ArtistName"].ToString(),
                                Followers = reader["Followers"] != DBNull.Value ? Convert.ToInt32(reader["Followers"]) : 0
                            });
                        }
                    }
                }
            }

            return Ok(new
            {
                UserID = userId,
                FollowingCount = followingArtists.Count,
                FollowingArtists = followingArtists
            });
        }
    }
}