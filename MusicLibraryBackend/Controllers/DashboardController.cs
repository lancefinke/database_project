using Microsoft.AspNetCore.Mvc;

using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using MusicLibraryBackend.Models;
using MusicLibraryBackend.Services;

namespace MusicLibraryBackend.Controllers
    
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public DashboardController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetArtistOverview")]
        public IActionResult GetArtistOverview(int artistId)
        {
            string query = @"
            SELECT 
                ArtistID,
                ArtistName,
                AverageRating,
                BannedSongCount,
                TotalListens,
                TotalSongs,
                TotalStrikes
            FROM vw_ArtistDashboard
            WHERE ArtistID = @ArtistID";

            var result = new ArtistDashboard();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand cmd = new SqlCommand(query, myCon))
                {
                    cmd.Parameters.AddWithValue("@ArtistID", artistId);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            result.ArtistID = Convert.ToInt32(reader["ArtistID"]);
                            result.ArtistName = reader["ArtistName"].ToString();
                            result.AverageRating = Convert.ToDouble(reader["AverageRating"]);
                            result.BannedSongCount = Convert.ToInt32(reader["BannedSongCount"]);
                            result.TotalListens = Convert.ToInt32(reader["TotalListens"]);
                            result.TotalSongs = Convert.ToInt32(reader["TotalSongs"]);
                            result.TotalStrikes = Convert.ToInt32(reader["TotalStrikes"]);
                            result.AccountStatus = result.TotalStrikes > 0 ? "Reported" : "Good Standing";
                        }
                        else
                        {
                            return NotFound("Artist not found.");
                        }
                    }
                }
            }

            return Ok(result);
        }
    }
}
