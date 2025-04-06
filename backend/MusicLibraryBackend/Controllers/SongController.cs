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
        public JsonResult GetSongs(int UserID)
        {
            var songs = new List<Song>();

            string query = "select * from dbo.songs,dbo.users WHERE users.UserID=@UserId AND songs.AuthorID=users.UserID";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                // queries the database
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                //parse the data received from the query
                {
                    myCommand.Parameters.AddWithValue("@UserID", UserID);
                    using (SqlDataReader reader = myCommand.ExecuteReader())
                    {
                        table.Load(reader);
                        reader.Close();
                        myCon.Close();
                    }
                }

            }
            return new JsonResult(table);
        }

        [HttpGet]
        [Route("GetSongsByName")]
        public JsonResult GetSongsByName(string Username)
        {
            var songs = new List<Song>();

            string query = "select * from dbo.songs,dbo.users WHERE users.Username=@Username AND songs.AuthorID=users.UserID";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                // queries the database
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                //parse the data received from the query
                {
                    myCommand.Parameters.AddWithValue("@Username", Username);
                    using (SqlDataReader reader = myCommand.ExecuteReader())
                    {
                        table.Load(reader);
                        reader.Close();
                        myCon.Close();
                    }
                }

            }
            return new JsonResult(table);
        }


        [HttpGet]
        [Route("GetSongsByGenre")]
        public JsonResult GetSongsByGenre(int GenreCode)
        {
            var songs = new List<Song>();

            string query = "SELECT * FROM SONGS,GENRECODING WHERE SONGS.GenreCode = GENRECODING.GenreCode AND SONGS.GenreCode=@GenreCode";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                // queries the database
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                //parse the data received from the query
                {
                    myCommand.Parameters.AddWithValue("@GenreCode", GenreCode );
                    using (SqlDataReader reader = myCommand.ExecuteReader())
                    {
                        table.Load(reader);
                        reader.Close();
                        myCon.Close();
                    }
                }

            }
            return new JsonResult(table);
        }


        [HttpGet]
        [Route("SearchSongs")]
        public JsonResult SearchSongs(string SearchQuery)
        {
            

            string query = "SELECT SONGS.GenreCode,SONGS.SongFileName,SONGS.SongName,SONGS.ReleaseDate,SONGS.CoverArtFileName,SONGS.Duration,SONGS.Rating,USERS.Username,ALBUM.Title FROM SONGS,ALBUM,ALBUMSONGS,USERS WHERE ALBUMSONGS.SongID=SONGS.SongID AND USERS.UserID=SONGS.AuthorID AND (ALBUM.Title LIKE @SearchQuery OR SONGS.SongName LIKE @SearchQuery OR USERS.Username LIKE @SearchQuery)";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCon.Open();
                    myCommand.Parameters.AddWithValue("@SearchQuery", SearchQuery+"%");
                    using (SqlDataReader reader = myCommand.ExecuteReader())
                    {
                        table.Load(reader);
                        reader.Close();
                        myCon.Close();
                    }
                    
                }

                

            }
            return new JsonResult(table);
        }

        [HttpGet]
        [Route("GetAlbumSongs")]
        public JsonResult GetAlbumSongs(int AlbumID)
        {


            string query = "SELECT SONGS.GenreCode,SONGS.SongFileName,SONGS.SongName,SONGS.ReleaseDate,SONGS.CoverArtFileName,SONGS.Duration,SONGS.Rating FROM ALBUM,SONGS,ALBUMSONGS WHERE ALBUMSONGS.SongID=SONGS.SongID AND ALBUMSONGS.AlbumID=ALBUM.AlbumID AND ALBUMSONGS.AlbumID=@AlbumID";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCon.Open();
                    myCommand.Parameters.AddWithValue("@AlbumID", AlbumID);
                    using (SqlDataReader reader = myCommand.ExecuteReader())
                    {
                        table.Load(reader);
                        reader.Close();
                        myCon.Close();
                    }

                }
            }
            return new JsonResult(table);
        }

        [HttpGet]
        [Route("GetPlaylistSongs")]
        public JsonResult GetPlaylistSongs(int PlaylistID)
        {


            string query = "SELECT SONGS.GenreCode,SONGS.SongFileName,SONGS.SongName,SONGS.ReleaseDate,SONGS.CoverArtFileName,SONGS.Duration,SONGS.Rating FROM PLAYLIST,SONGS, PLAYLISTSONGS WHERE PLAYLISTSONGS.SongID=SONGS.SongID AND PLAYLISTSONGS.PlaylistID=PLAYLIST.PlaylistID AND PLAYLISTSONGS.PlaylistID=@PlaylistID";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCon.Open();
                    myCommand.Parameters.AddWithValue("@PlaylistID", PlaylistID);
                    using (SqlDataReader reader = myCommand.ExecuteReader())
                    {
                        table.Load(reader);
                        reader.Close();
                        myCon.Close();
                    }

                }
            }
            return new JsonResult(table);
        }

        [HttpGet]
        [Route("GetReportedSongs")]
        public JsonResult GetReportedSongs()
        {
            var songs = new List<Song>();

            string query = "SELECT * FROM dbo.SONGS WHERE SONGS.IsReported=1";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                // queries the database
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                //parse the data received from the query
                using (SqlDataReader reader = myCommand.ExecuteReader())
                {
                    table.Load(reader);
                    reader.Close();
                    myCon.Close();
                }

            }
            return new JsonResult(table);
        }
    }
}