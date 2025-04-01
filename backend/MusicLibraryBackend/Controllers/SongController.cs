using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using Microsoft.Data.SqlClient;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using MusicLibraryBackend.Models;



namespace database.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class databaseController : ControllerBase
    {
        private IConfiguration _configuration;
        private BlobServiceClient blobServiceClient;

        public databaseController(IConfiguration configuration)
        {
            _configuration = configuration;
            /*/
            var connectionStrings = _configuration.GetSection("ConnectionStrings");
            string blobConnectionString = _configuration["ConnectionStrings:blobDB"];

 
            Console.WriteLine("YOWHATUSP GUYS");
            Console.WriteLine(blobConnectionString);
            blobServiceClient = new BlobServiceClient(blobConnectionString);
            /*/
            try
            {
                var connectionStrings = _configuration.GetSection("ConnectionStrings");
                string blobConnectionString = _configuration["ConnectionStrings:blobDB"];


                blobServiceClient = new BlobServiceClient(blobConnectionString);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error initializing BlobServiceClient: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("UploadSong")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadSong(string songName, IFormFile SongMP3, IFormFile SongPicture)
        {
            try
            {

                BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("songfilecontainer");

                string uniqueID = Guid.NewGuid().ToString();
                string uniqueSongName = $"uploads/" + uniqueID + ".mp3";
                string uniquePictureName = $"uploads/" + uniqueID + ".png";
                BlobClient blobClient = containerClient.GetBlobClient(uniqueSongName);
                BlobClient songClient = containerClient.GetBlobClient(uniquePictureName);

                // Upload the file
                using (var stream = SongMP3.OpenReadStream())
                {
                    await blobClient.UploadAsync(stream, true);
                }
                using (var pic = SongPicture.OpenReadStream())
                {
                    await songClient.UploadAsync(pic, true);
                }


                string blobUrl = "https://songcontainer.blob.core.windows.net/songs/uploads/" + uniqueID + ".mp3";
                string songUrl = "https://songcontainer.blob.core.windows.net/songs/uploads/" + uniqueID + ".png";



                string query = "INSERT INTO dbo.songs (SongName, BlobUrl, songpicture) VALUES (@SongName, @BlobUrl,@SongPicture)";
                DataTable table = new DataTable();
                string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    myCon.Open();
                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@SongName", songName);
                        myCommand.Parameters.AddWithValue("@BlobUrl", blobUrl);
                        myCommand.Parameters.AddWithValue("@SongPicture", songUrl);

                        SqlDataReader myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myCon.Close();
                    }
                }
                string message = "Upload Successful. Here is the URL: " + blobUrl + "/n Here is the songUrl: " + songUrl;

                return new JsonResult(message);


            }

            catch (Exception ex)
            {
                return new JsonResult($"Upload Failed: {ex.Message}");
            }
        }



        [HttpGet]
        [Route("GetSongs")]
        public JsonResult GetSongs()
        {
            var songs = new List<Song>();

            string query = "select * from dbo.songs";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
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
                        songs.Add(new Song
                        {
                            SongID = myReader["SongID"] != DBNull.Value ? Convert.ToInt32(myReader["SongID"]) : 0,
                            GenreCode = myReader["GenreCode"] != DBNull.Value ? Convert.ToInt32(myReader["SongID"]) : 0,
                            SongFileName = myReader["SongFileName"] != DBNull.Value ? myReader["SongFileName"].ToString() : null,
                            Title = myReader["Title"] != DBNull.Value ? myReader["Title"].ToString() : null,
                            ReleaseDate = myReader["ReleaseDate"] != DBNull.Value ? Convert.ToDateTime(myReader["ReleaseDate"]) : DateTime.MinValue,
                            CoverArtFileName = myReader["CoverArtFileName"] != DBNull.Value ? myReader["CoverArtFileName"].ToString() : null,
                            Duration = myReader["Duration"] != DBNull.Value ? Convert.ToInt32(myReader["Duration"]) : 0,
                            AuthorID = myReader["AuthorID"] != DBNull.Value ? Convert.ToInt32(myReader["AuthorID"]) : 1,
                            Rating = myReader["Rating"] != DBNull.Value ? Convert.ToDouble(myReader["Rating"]) : 1,
                            AlbumID = myReader["AlbumID"] != DBNull.Value ? Convert.ToInt32(myReader["AlbumID"]) : 0,
                            IsReported = myReader["IsReported"] != DBNull.Value ? Convert.ToBoolean(myReader["IsReported"]) : false


                        });
                    }
                }

            }
            return new JsonResult(table);
        }
    }
}