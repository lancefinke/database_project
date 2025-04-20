using Microsoft.Data.SqlClient;
using MusicLibraryBackend.Models;

namespace MusicLibraryBackend.Services
{
    public class ListenService
    {
        private readonly IConfiguration _configuration;

        public ListenService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public bool AddListen(ListenRequest request)
        {
            string connectionString = _configuration.GetConnectionString("DatabaseConnection");

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();

                SqlTransaction transaction = conn.BeginTransaction();

                try
                {
                    // Step 1: Check if this (UserID, SongID) pair already exists
                    string checkQuery = @"
                    SELECT COUNT(*) FROM Listens
                    WHERE UserID = @UserID AND SongID = @SongID";

                    using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn, transaction))
                    {
                        checkCmd.Parameters.AddWithValue("@UserID", request.UserID);
                        checkCmd.Parameters.AddWithValue("@SongID", request.SongID);

                        int exists = (int)checkCmd.ExecuteScalar();
                        if (exists > 0)
                        {
                            transaction.Rollback();
                            return false; // already exists, don't insert
                        }
                    }

                    // Step 2: Insert new listen
                    string insertQuery = @"
                    INSERT INTO Listens (UserID, SongID)
                    VALUES (@UserID, @SongID)";

                    using (SqlCommand insertCmd = new SqlCommand(insertQuery, conn, transaction))
                    {
                        insertCmd.Parameters.AddWithValue("@UserID", request.UserID);
                        insertCmd.Parameters.AddWithValue("@SongID", request.SongID);
                        insertCmd.ExecuteNonQuery();
                    }

                    // Step 3: Update Song's listen count
                    string updateQuery = @"
                    UPDATE Songs
                    SET Listens = (SELECT COUNT(*) FROM Listens WHERE SongID = @SongID)
                    WHERE SongID = @SongID";

                    using (SqlCommand updateCmd = new SqlCommand(updateQuery, conn, transaction))
                    {
                        updateCmd.Parameters.AddWithValue("@SongID", request.SongID);
                        updateCmd.ExecuteNonQuery();
                    }

                    transaction.Commit();
                    return true;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    Console.WriteLine("Error inserting listen: " + ex.Message);
                    return false;
                }
            }
        }
    }

}
