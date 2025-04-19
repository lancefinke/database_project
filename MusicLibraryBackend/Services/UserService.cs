using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MusicLibraryBackend.Models;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

using System.Data;


namespace MusicLibraryBackend.Services

{
    public class UserService
    {

        private readonly IConfiguration _configuration;
        private const string ConnectionStringKey = "DatabaseConnection";
        private BlobServiceClient blobServiceClient;

        public UserService(IConfiguration configuration)
        {
            _configuration = configuration;
            string blobConnectionString = _configuration["ConnectionStrings:blobDB"];

            blobServiceClient = new BlobServiceClient(blobConnectionString);
        }
        public List<User> GetAllUsers()
        {
            List<User> users = new List<User>();
            string query = @"
            SELECT 
            u.UserID, u.Username, u.Email, u.ProfilePicture, u.Bio, 
            u.UserPassword, u.CreatedAt, u.isArtist, 
            a.StrikeCount,a.ArtistID
            FROM dbo.USERS u
            LEFT JOIN dbo.ARTISTS a ON u.UserID = a.UserID
            WHERE u.isDeactivated = 0 AND u.isAdmin = 0";

            // access the database
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            // creates the connection
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                // queries the database
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                //parse the data received from the query
                using (SqlDataReader myReader = myCommand.ExecuteReader())
                {
                    while (myReader.Read())
                    {
                        users.Add(new User
                        {
                            UserID = myReader["UserID"] != DBNull.Value ? Convert.ToInt32(myReader["UserID"]) : 0,
                            Username = myReader["Username"] != DBNull.Value ? myReader["Username"].ToString() : null,
                            Email = myReader["Email"] != DBNull.Value ? myReader["Email"].ToString() : null,
                            ProfilePicture = myReader["ProfilePicture"] != DBNull.Value ? myReader["ProfilePicture"].ToString() : null,
                            Bio = myReader["Bio"] != DBNull.Value ? myReader["Bio"].ToString() : null,
                            UserPassword = myReader["UserPassword"] != DBNull.Value ? myReader["UserPassword"].ToString() : null,
                            CreatedAt = myReader["CreatedAt"] != DBNull.Value ? Convert.ToDateTime(myReader["CreatedAt"]) : DateTime.MinValue,
                            isArtist = myReader["isArtist"] != DBNull.Value ? Convert.ToBoolean(myReader["isArtist"]): false,
                            StrikeCount = myReader["StrikeCount"] != DBNull.Value ? Convert.ToInt32(myReader["StrikeCount"]) : 0,
                            ArtistID = myReader["ArtistID"] != DBNull.Value ? Convert.ToInt32(myReader["ArtistID"]) : 0,


                        });

                    }
                }

            }
            return users;
        }
        public async Task<IActionResult> CreateUser(
            string newUserName,
            string newEmail,
            IFormFile newPictureURL,
            string newBio,
            string newPassword,
            bool role)
        {
            string query = "insert into dbo.USERS(Username, Email, ProfilePicture, Bio, UserPassword, CreatedAt, isArtist) values(@newUserName,@newEmail,@newPictureURL,@newBio,@newPassword,@newDateCreation,@role)";

            // access the database
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            BlobContainerClient blobcontainer = blobServiceClient.GetBlobContainerClient("profileimagecontainer");

            string uniqueID = Guid.NewGuid().ToString();
            string uniquePhoto = $"uploads/" + uniqueID + ".png";
            BlobClient blobclient = blobcontainer.GetBlobClient(uniquePhoto);

            using (var stream = newPictureURL.OpenReadStream())
            {
                await blobclient.UploadAsync(stream, true);
            }
            string profilepictureurl = "https://blobcontainer2005.blob.core.windows.net/profileimagecontainer/uploads/" + uniqueID + ".png";

            // creates the connection
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                // queries the database
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {

                    // gets current date instead of having to input 
                    DateOnly currentDate = DateOnly.FromDateTime(DateTime.Now);
                    // myCommand.Parameters.AddWithValue("@newUserID", newUserID);
                    // parameters for the queries
                    myCommand.Parameters.AddWithValue("@newUserName", newUserName);
                    myCommand.Parameters.AddWithValue("@newEmail", newEmail);
                    myCommand.Parameters.AddWithValue("@newPictureURL", profilepictureurl);
                    myCommand.Parameters.AddWithValue("@newBio", newBio);
                    myCommand.Parameters.AddWithValue("@newPassword", newPassword);
                    myCommand.Parameters.AddWithValue("@newDateCreation", currentDate.ToDateTime(TimeOnly.MinValue));
                    myCommand.Parameters.AddWithValue("@role", role);
                    myCommand.ExecuteNonQuery();
                }
            }

            return new JsonResult($"User with name {newUserName} added successfully");

        }

        public List<Follower> GetUserFollowers(int userId)
        {
            var followers = new List<Follower>();
            string query = "SELECT * FROM FOLLOWERS,USERS WHERE FOLLOWERS.FollowerID=USERS.UserID AND FOLLOWERS.FollowedID=@UserId";

            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                using (SqlCommand cmd = new SqlCommand(query, myCon))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);
                    myCon.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            followers.Add(new Follower
                            {
                                UserID = reader["UserID"] != DBNull.Value ? Convert.ToInt32(reader["UserID"]) : 0,
                                Username = reader["Username"] != DBNull.Value ? reader["Username"].ToString() : null,
                                FollowedID = reader["FollowedID"] != DBNull.Value ? Convert.ToInt32(reader["FollowedID"]) : 0,
                            });
                        }
                    }
                }
            }
            return followers;
        }

        public User GetUserByName(string name)
        {
            var user = new User();
            string query = "SELECT * FROM USERS WHERE USERS.Username=@Username AND isDeactivated = 0";

            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                using (SqlCommand cmd = new SqlCommand(query, myCon))
                {
                    cmd.Parameters.AddWithValue("@Username", name);
                    myCon.Open();

                    using (SqlDataReader myReader = cmd.ExecuteReader())
                    {
                        while (myReader.Read())
                        {

                            user.UserID = myReader["UserID"] != DBNull.Value ? Convert.ToInt32(myReader["UserID"]) : 0;
                            user.Username = myReader["Username"] != DBNull.Value ? myReader["Username"].ToString() : null;
                            user.Email = myReader["Email"] != DBNull.Value ? myReader["Email"].ToString() : null;
                            user.ProfilePicture = myReader["ProfilePicture"] != DBNull.Value ? myReader["ProfilePicture"].ToString() : null;
                            user.Bio = myReader["Bio"] != DBNull.Value ? myReader["Bio"].ToString() : null;
                            user.UserPassword = myReader["UserPassword"] != DBNull.Value ? myReader["UserPassword"].ToString() : null;
                            user.CreatedAt = myReader["CreatedAt"] != DBNull.Value ? Convert.ToDateTime(myReader["CreatedAt"]) : DateTime.MinValue;
                            user.isArtist = myReader["isArtist"] != DBNull.Value ? Convert.ToBoolean(myReader["isArtist"]) : false;

                        }
                    }
                }
            }
            return user;
        }
        public bool BanUser(BanUserRequest request)
        {
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                SqlTransaction transaction = myCon.BeginTransaction();

                try
                {
                    if (request.ArtistID.HasValue)
                    {
                        int userIdFromArtist = -1;

                        // Fetch UserID from Artist table
                        string getUserIdQuery = "SELECT UserID FROM Artists WHERE ArtistID = @ArtistID";
                        using (SqlCommand getUserCmd = new SqlCommand(getUserIdQuery, myCon, transaction))
                        {
                            getUserCmd.Parameters.AddWithValue("@ArtistID", request.ArtistID.Value);
                            var result = getUserCmd.ExecuteScalar();

                            if (result == null)
                                throw new Exception("No user found for provided ArtistID.");

                            userIdFromArtist = Convert.ToInt32(result);
                        }

                        // Update Artist table
                        string updateArtist = @"
                    UPDATE Artists 
                    SET IsDeactivated = 1 
                    WHERE ArtistID = @ArtistID";

                        using (SqlCommand cmd = new SqlCommand(updateArtist, myCon, transaction))
                        {
                            cmd.Parameters.AddWithValue("@ArtistID", request.ArtistID.Value);
                            cmd.ExecuteNonQuery();
                        }

                        // Update Users table using the fetched UserID
                        string updateUser = @"
                    UPDATE Users 
                    SET IsDeactivated = 1, BannedAt = GETDATE()
                    WHERE UserID = @UserID";

                        using (SqlCommand cmd = new SqlCommand(updateUser, myCon, transaction))
                        {
                            cmd.Parameters.AddWithValue("@UserID", userIdFromArtist);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    else if (request.UserID.HasValue)
                    {
                        // Update only Users table
                        string updateUser = @"
                    UPDATE Users 
                    SET IsDeactivated = 1, BannedAt = GETDATE()
                    WHERE UserID = @UserID";

                        using (SqlCommand cmd = new SqlCommand(updateUser, myCon, transaction))
                        {
                            cmd.Parameters.AddWithValue("@UserID", request.UserID.Value);
                            cmd.ExecuteNonQuery();
                        }
                    }
                    else
                    {
                        throw new ArgumentException("Either ArtistID or UserID must be provided.");
                    }

                    transaction.Commit();
                    return true;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    Console.WriteLine("Error during ban process: " + ex.ToString());
                    throw;
                }
            }
        }



        /// <summary>
        /// Retrieves all banned users from the database
        /// </summary>
        /// <returns>List of banned users with their ban information</returns>
        public List<BannedUser> GetBannedUsers()
        {
            List<BannedUser> bannedUsers = new List<BannedUser>();
            string query = @"
        SELECT 
            Username,
            Email,
            CreatedAt,
            BannedAt,
            isArtist
        FROM USERS
        WHERE IsDeactivated = 1
        ORDER BY BannedAt DESC";

            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            try
            {
                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        while (myReader.Read())
                        {
                            bannedUsers.Add(new BannedUser
                            {
                                Username = myReader["Username"].ToString(),
                                Email = myReader["Email"].ToString(),
                                CreatedAt = Convert.ToDateTime(myReader["CreatedAt"]),
                                BannedAt = myReader["BannedAt"] != DBNull.Value
                                ? (DateTime?)Convert.ToDateTime(myReader["BannedAt"]): null,
                                isArtist = Convert.ToBoolean(myReader["isArtist"])


                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetBannedUsers: {ex.Message}");
                throw;
            }

            return bannedUsers;
        }
    }
}
