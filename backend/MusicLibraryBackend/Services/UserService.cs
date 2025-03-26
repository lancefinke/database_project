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
      

                        });


                    }
                }

            }
            return users;
        }
        public List<User> SearchUsers(string search)
        {
            List<User> users = new List<User>();
            string query = "SELECT * FROM dbo.USERS WHERE Username LIKE @search";
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@search", "%" + search + "%");

                    using (SqlDataReader myReader = myCommand.ExecuteReader())
                    {
                        while (myReader.Read())
                        {
                            users.Add(new User
                            {
                                UserID = myReader["UserID"] != DBNull.Value ? Convert.ToInt32(myReader["UserID"]) : 0,
                                Username = myReader["Username"]?.ToString(),
                                Email = myReader["Email"]?.ToString(),
                                ProfilePicture = myReader["ProfilePicture"]?.ToString(),
                                Bio = myReader["Bio"]?.ToString(),
                                UserPassword = myReader["UserPassword"]?.ToString(),
                                CreatedAt = myReader["CreatedAt"] != DBNull.Value ? Convert.ToDateTime(myReader["CreatedAt"]) : DateTime.MinValue,
                                isArtist = myReader["isArtist"] != DBNull.Value ? Convert.ToBoolean(myReader["isArtist"]) : false
                            });
                        }
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
    }
}


