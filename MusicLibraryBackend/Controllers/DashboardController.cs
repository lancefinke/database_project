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

        [HttpGet("GetSongPerformance")]
        public IActionResult GetSongPerformance(int artistId)
        {
            try
            {
                string query = @"
            SELECT 
                SongID,
                SongName,
                Rating,
                Listens,
                ReleaseDate
            FROM vw_ArtistSongPerformance
            WHERE ArtistID = @ArtistID AND IsDeleted = 0
            ORDER BY Rating DESC, Listens DESC";

                var songList = new List<object>();

                using (SqlConnection con = new SqlConnection(_configuration.GetConnectionString("DatabaseConnection")))
                {
                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        cmd.Parameters.AddWithValue("@ArtistID", artistId);
                        con.Open();

                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                songList.Add(new
                                {
                                    songID = Convert.ToInt32(reader["SongID"]),
                                    Title = reader["SongName"].ToString(),
                                    Rating = reader["Rating"] != DBNull.Value ? Convert.ToDouble(reader["Rating"]) : 0,
                                    Listens = reader["Listens"] != DBNull.Value ? Convert.ToInt32(reader["Listens"]) : 0,
                                    ReleaseDate = reader["ReleaseDate"] != DBNull.Value ? Convert.ToDateTime(reader["ReleaseDate"]).ToString("yyyy-MM-dd") : null
                                });
                            }
                        }
                    }
                }

                return Ok(songList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet("GetReportedSongsByArtist")]
        public IActionResult GetReportedSongsByArtist([FromQuery] int artistId)
        {
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            var reportedSongs = new List<object>();

            using (SqlConnection con = new SqlConnection(sqlDatasource))
            {
                string query = @"
            SELECT SongID, SongName, Reason, DateReported, ReportStatus
            FROM vw_ReportedSongsByArtist
            WHERE ArtistID = @ArtistID
            ORDER BY DateReported ASC";

                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@ArtistID", artistId);
                    con.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        var acceptedSongIds = new HashSet<int>();

                        while (reader.Read())
                        {
                            int songId = Convert.ToInt32(reader["SongID"]);
                            int reportStatus = Convert.ToInt32(reader["ReportStatus"]);

                            // Only allow the first 'Accepted' (status 3) entry per song
                            if (reportStatus == 3 && acceptedSongIds.Contains(songId))
                                continue;

                            if (reportStatus == 3)
                                acceptedSongIds.Add(songId);

                            reportedSongs.Add(new
                            {
                                SongID = songId,
                                Title = reader["SongName"].ToString(),
                                Reason = reader["Reason"].ToString(),
                                ReportDate = Convert.ToDateTime(reader["DateReported"]),
                                ReportStatus = reportStatus
                            });
                        }
                    }
                }
            }

            return Ok(reportedSongs);
        }
    }
}
