using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MusicLibraryBackend.Models;
using System.Data;

namespace MusicLibraryBackend.Services

{
    public class UserService
    {
        private readonly IConfiguration _configuration;
        private const string ConnectionStringKey = "DatabaseConnection";

        public UserService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public List<User> GetAllUsers()
        {
            List<User> users = new List<User>();
            string query = "select * from dbo.USERS where";

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
                            isArtist = myReader["isArtist"] != DBNull.Value ? Convert.ToBoolean(myReader["isArtist"]) : false
                            //    users.Add(new User
                            //{
                            //    UserID = Convert.ToInt32(myReader["UserID"]),
                            //    Username = myReader["Username"].ToString(),
                            //    Email = myReader["Email"].ToString(),
                            //    ProfilePicture = myReader["ProfilePicture"].ToString(),
                            //    Bio = myReader["Bio"].ToString(),
                            //    UserPassword = myReader["UserPassword"].ToString(),
                            //    CreatedAt = Convert.ToDateTime(myReader["CreatedAt"]),
                            //    isArtist = Convert.ToBoolean(myReader["isArtist"])

                        });

                    }
                }

            }
            return users;
        }
        public string CreateUser(
            string newUserName,
            string newEmail,
            string newPictureURL,
            string newBio,
            string newPassword,
            bool role)
        {
            string query = "insert into dbo.USERS(Username, Email, ProfilePicture, Bio, UserPassword, CreatedAt, isArtist) values(@newUserName,@newEmail,@newPictureURL,@newBio,@newPassword,@newDateCreation,@role)";

            // access the database
            string sqlDatasource = _configuration.GetConnectionString("DefaultConnection");

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
                    myCommand.Parameters.AddWithValue("@newPictureURL", newPictureURL);
                    myCommand.Parameters.AddWithValue("@newBio", newBio);
                    myCommand.Parameters.AddWithValue("@newPassword", newPassword);
                    myCommand.Parameters.AddWithValue("@newDateCreation", currentDate.ToDateTime(TimeOnly.MinValue));
                    myCommand.Parameters.AddWithValue("@role", role);
                    myCommand.ExecuteNonQuery();
                }
            }
            return "Added Succesfully";
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
            string query = "SELECT * FROM USERS WHERE USERS.Username=@Username";

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
        public bool BanUser(
           string userName,
            string email,
            string reason)
        {
            User user = GetUserByName(userName);

            if (user == null || user.UserID == 0)
            {
                return false; // User not found
            }
            string updatequery = "UPDATE USERS SET isDeactivated = 1 WHERE ID = @userID";
            string bannedquery = "INSERT INTO dbo.BANNEDUSERS(UserID,UserEmail,DateBanned,Reason) VALUES(@UserID,@Email,@DateBanned,@Reason)";

            // access the database
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            // creates the connection
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                // queries the database
                using (SqlCommand updateCommand = new SqlCommand(updatequery, myCon))
                {

                    updateCommand.Parameters.AddWithValue("@UserId", user.UserID);
                    int rowsAffected = updateCommand.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return false;
                    }
                }
                using (SqlCommand myCommand = new SqlCommand(bannedquery, myCon))
                {

                    // gets current date instead of having to input 
                    DateTime currentDate = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Hour, DateTime.Now.Minute, 0);

                    myCommand.Parameters.AddWithValue("@UserID", user.UserID);
                    // parameters for the queries
                    myCommand.Parameters.AddWithValue("@Email", email);
                    myCommand.Parameters.AddWithValue("@Reason", reason);
                    myCommand.Parameters.AddWithValue("@DateBanned", currentDate);
                    myCommand.ExecuteNonQuery();
                }
            }
            return true;
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
                    u.Username,
                    u.Email,
                    b.Reason as BanReason,
                    b.DateBanned
                FROM USERS u
                INNER JOIN BANNEDUSERS b ON u.UserID = b.UserID
                ORDER BY b.DateBanned DESC";

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
                                Username = myReader["Username"] != DBNull.Value ? myReader["Username"].ToString() : null,
                                Email = myReader["Email"] != DBNull.Value ? myReader["Email"].ToString() : null,
                                BanReason = myReader["BanReason"] != DBNull.Value ? myReader["BanReason"].ToString() : null,
                                DateBanned = myReader["DateBanned"] != DBNull.Value ? Convert.ToDateTime(myReader["DateBanned"]) : DateTime.MinValue
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
