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
        public UserService(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public List<User> GetAllUsers()
        {
            List<User> users = new List<User>();
            string query = "select * from dbo.USERS";

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
                        users.Add(new User { 
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
    }
}


