using Microsoft.Data.SqlClient;
using MusicLibraryBackend.Models;

namespace MusicLibraryBackend.Services
{
    public class RatingService
    {
        private readonly string _connectionString;

        public RatingService(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("DatabaseConnection");
        }

        public RatingResponse SubmitRating(RatingRequest request)
        {
            using var conn = new SqlConnection(_connectionString);
            conn.Open();

            // Check if the user already rated the song
            var checkCmd = new SqlCommand(@"
            SELECT COUNT(*) FROM LIKES
            WHERE userID = @UserId AND songID = @SongId", conn);

            checkCmd.Parameters.AddWithValue("@UserId", request.UserId);
            checkCmd.Parameters.AddWithValue("@SongId", request.SongId);

            int exists = (int)checkCmd.ExecuteScalar();

            if (exists > 0)
            {
                // Update existing rating
                var updateCmd = new SqlCommand(@"
                UPDATE LIKES
                SET Rating = @Rating
                WHERE userID = @UserId AND songID = @SongId", conn);

                updateCmd.Parameters.AddWithValue("@Rating", request.Rating);
                updateCmd.Parameters.AddWithValue("@UserId", request.UserId);
                updateCmd.Parameters.AddWithValue("@SongId", request.SongId);
                updateCmd.ExecuteNonQuery();
            }
            else
            {
                // Insert new rating
                var insertCmd = new SqlCommand(@"
                INSERT INTO LIKES (userID, songID, Rating)
                VALUES (@UserId, @SongId, @Rating)", conn);

                insertCmd.Parameters.AddWithValue("@UserId", request.UserId);
                insertCmd.Parameters.AddWithValue("@SongId", request.SongId);
                insertCmd.Parameters.AddWithValue("@Rating", request.Rating);
                insertCmd.ExecuteNonQuery();
            }

            // Calculate average and count
            var resultCmd = new SqlCommand(@"
            SELECT 
                AVG(CAST(Rating AS FLOAT)) AS AverageRating,
                COUNT(*) AS RatingCount
            FROM LIKES
            WHERE songID = @SongId", conn);

            resultCmd.Parameters.AddWithValue("@SongId", request.SongId);

            var reader = resultCmd.ExecuteReader();
            var response = new RatingResponse();

            if (reader.Read())
            {
                response.AverageRating = (float)Math.Round(reader.GetDouble(0), 1);
                response.RatingCount = reader.GetInt32(1);
            }
            reader.Close();

            float roundedAverage = (float)Math.Round(response.AverageRating, 1);
            var updateSongCmd = new SqlCommand(@"
                UPDATE Songs
                SET TotalRatings =@AvgRating
                WHERE SongID = @SongId", conn);

            updateSongCmd.Parameters.AddWithValue("@AvgRating", roundedAverage);
            updateSongCmd.Parameters.AddWithValue("@SongId", request.SongId);
            updateSongCmd.ExecuteNonQuery();

            return response;
        }


    }
}