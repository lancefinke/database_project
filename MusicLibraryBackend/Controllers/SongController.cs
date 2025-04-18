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
        public async Task<IActionResult> UploadSong(string songName, IFormFile SongMP3, IFormFile SongPicture, int authorID, int albumID, int genreCode)
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

                string blobUrl = "https://blobcontainer2005.blob.core.windows.net/songfilecontainer/uploads/" + uniqueID + ".mp3";
                string songUrl = "https://blobcontainer2005.blob.core.windows.net/songfilecontainer/uploads/" + uniqueID + ".png";

                var ffProbe = new NReco.VideoInfo.FFProbe();
                var videoInfo = ffProbe.GetMediaInfo(blobUrl);
                Console.WriteLine(videoInfo.FormatName);
                Console.WriteLine(videoInfo.Duration);
                int duration = (int)videoInfo.Duration.TotalSeconds;

                int songID;
                DataTable table = new DataTable();
                string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    myCon.Open();

                    // returns the song id idk got it from chat
                    string query = "INSERT INTO dbo.songs (SongName, SongFileName, coverArtFileName, authorID, Duration,GenreCode,ReleaseDate) " +
                                   "OUTPUT INSERTED.SongID " +
                                   "VALUES (@SongName, @BlobUrl, @SongPicture, @authorID, @Duration,@GenreCode,@ReleaseDate)";

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {
                        myCommand.Parameters.AddWithValue("@SongName", songName);
                        myCommand.Parameters.AddWithValue("@BlobUrl", blobUrl);
                        myCommand.Parameters.AddWithValue("@SongPicture", songUrl);
                        myCommand.Parameters.AddWithValue("@authorID", authorID);
                        myCommand.Parameters.AddWithValue("@Duration", duration);
                        myCommand.Parameters.AddWithValue("@GenreCode", genreCode);
                        myCommand.Parameters.AddWithValue("@ReleaseDate", DateTime.Now);

                        // gets id 
                        songID = (int)myCommand.ExecuteScalar();
                    }


                    if (albumID > 0)
                    {
                        string albumSongQuery = "INSERT INTO dbo.albumSongs (AlbumID, SongID) VALUES (@AlbumID, @SongID)";

                        using (SqlCommand albumCommand = new SqlCommand(albumSongQuery, myCon))
                        {
                            albumCommand.Parameters.AddWithValue("@AlbumID", albumID);
                            albumCommand.Parameters.AddWithValue("@SongID", songID);
                            albumCommand.ExecuteNonQuery();
                        }
                    }

                    myCon.Close();
                }

                string message = "Upload Successful. Song added to album. URL: " + blobUrl + " | Cover: " + songUrl;
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

            //string query = "select * from dbo.songs,dbo.users,dbo.artists WHERE users.UserID=@UserId AND songs.AuthorID = artists.ArtistID AND artists.UserID = users.UserID";
            string query = @"
        SELECT 
            s.SongID,
            s.GenreCode,
            s.SongFileName,
            s.ReleaseDate,
            s.CoverArtFileName,
            s.Duration,
            s.AuthorID,
            s.TotalRatings,
            s.IsReported,
            s.SongName,
            s.IsDeleted,
            s.Listens,
            u.UserID,
            u.Username,
            u.Email,
            u.Bio,
            u.CreatedAt,
            u.isArtist,
            u.ProfilePicture,
            u.isDeactivated,
            a.ArtistID,
            a.StrikeCount
        FROM Songs s
        INNER JOIN Artists a ON s.AuthorID = a.ArtistID
        INNER JOIN Users u ON a.UserID = u.UserID
        WHERE u.UserID = @UserID
          AND s.IsDeleted = 0
          AND u.isDeactivated = 0";

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

            string query = "select * from dbo.songs,dbo.users,dbo.artists WHERE users.Username=@Username AND songs.AuthorID=artists.artistID AND artists.UserID = users.UserID AND songs.IsDeleted = 0 AND users.isDeactivated = 0";
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
        [Route("GetSongsByRating")]
        public JsonResult GetSongsByRating()
        {
            var songs = new List<Song>();

            string query = "select TOP 10 songs.SongName,songs.SongID, songs.SongFileName,songs.Duration,users.Username, songs.TotalRatings,songs.CoverArtFileName from dbo.songs,dbo.users,dbo.artists WHERE songs.AuthorID=artists.artistID AND users.UserID = artists.UserID AND songs.IsDeleted = 0 AND users.isDeactivated = 0 order by songs.TotalRatings desc ";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                // queries the database
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                //parse the data received from the query
                {
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

            string query = "SELECT * FROM SONGS,GENRECODING WHERE SONGS.GenreCode = GENRECODING.GenreCode AND SONGS.GenreCode=@GenreCode AND SONGS.IsDeleted = 0";
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
        [Route("GetGenre")]
        public JsonResult GetGenre(string GenreCode)
        {   


            string query = "select genrecoding.GenreText from genrecoding where genrecoding.GenreCode = @GenreCode";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCon.Open();
                    myCommand.Parameters.AddWithValue("@GenreCode", GenreCode);
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


            string query = "SELECT DISTINCT SONGS.SongID,SONGS.GenreCode,SONGS.SongFileName,SONGS.SongName,SONGS.ReleaseDate,SONGS.CoverArtFileName,SONGS.Duration,SONGS.TotalRatings,USERS.Username,ALBUM.AlbumID,ALBUM.Title FROM SONGS JOIN  USERS ON USERS.UserID = SONGS.AuthorID JOIN  ALBUMSONGS ON ALBUMSONGS.SongID = SONGS.SongID JOIN ALBUM ON ALBUM.AlbumID = ALBUMSONGS.AlbumID WHERE  SONGS.IsDeleted = 0 AND (SONGS.SongName  LIKE @SearchQuery  OR USERS.Username LIKE @SearchQuery OR ALBUM.Title LIKE @SearchQuery)";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCon.Open();
                    myCommand.Parameters.AddWithValue("@SearchQuery", SearchQuery + "%");
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


            string query = "SELECT SONGS.GenreCode,SONGS.SongFileName,SONGS.SongName,SONGS.ReleaseDate,SONGS.CoverArtFileName,SONGS.Duration,SONGS.TotalRatings FROM ALBUM,SONGS,ALBUMSONGS WHERE ALBUMSONGS.SongID=SONGS.SongID AND ALBUMSONGS.AlbumID=ALBUM.AlbumID AND ALBUMSONGS.AlbumID=@AlbumID AND  SONGS.IsDeleted = 0";
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

        [HttpPost]
        [Route("UploadAlbum")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadAlbum(string albumName, IFormFile AlbumPicture, int userID, string AlbumDescription)
        {
            try
            {
                BlobContainerClient containerClient = blobServiceClient.GetBlobContainerClient("albumimagecontainer");

                string uniqueID = Guid.NewGuid().ToString();
                string uniqueAlbumPhoto = $"uploads/" + uniqueID + ".png";
                BlobClient blobclient = containerClient.GetBlobClient(uniqueAlbumPhoto);

                //uploads file
                using (var stream = AlbumPicture.OpenReadStream())
                {
                    await blobclient.UploadAsync(stream, true);
                }
                int artistID = 0;
                string bloburl = "https://blobcontainer2005.blob.core.windows.net/albumimagecontainer/uploads/" + uniqueID + ".png";
                

                string query = "INSERT INTO dbo.album(Title, ArtistID, AlbumDescription, AlbumCoverArtFileName) VALUES (@albumName, @artistID, @albumDescription, @bloburl)";
                string getArtistQuery = "SELECT ArtistID FROM artists WHERE UserID = @userID";

                DataTable table = new DataTable();
                string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");


                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    myCon.Open();
                    using (SqlCommand getArtistCommand = new SqlCommand(getArtistQuery, myCon))
                    {
                        getArtistCommand.Parameters.AddWithValue("@userID", userID);
                        var result = await getArtistCommand.ExecuteScalarAsync();

                        if (result == null)
                            return BadRequest("Artist not found for this user.");

                        artistID = Convert.ToInt32(result);
                    }

                    using (SqlCommand myCommand = new SqlCommand(query, myCon))
                    {

                        myCommand.Parameters.AddWithValue("@albumName", albumName);
                        myCommand.Parameters.AddWithValue("@bloburl", bloburl);
                        myCommand.Parameters.AddWithValue("@artistID", artistID);
                        myCommand.Parameters.AddWithValue("@albumDescription", AlbumDescription);

                        SqlDataReader myReader = myCommand.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        myCon.Close();
                    }
                }
                string message = "Upload Successful. Here is the URL: " + bloburl;

                return new JsonResult(message);

            }



            catch (Exception ex)
            {
                return new JsonResult($"Upload Failed: {ex.Message}");
            }
        }


        [HttpGet]
        [Route("GetUserPlaylists")]
        public JsonResult GetUserPlaylists(int UserID)
        {

            string query = "SELECT playlist.PlaylistID, playlist.Title,playlist.PlaylistDescription,playlist.Duration,playlist.PlaylistPicture from playlist, users where playlist.UserID = users.UserID AND users.UserID = @UserID";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCon.Open();
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
        [Route("GetUserAlbums")]
        public JsonResult GetUserAlbums(int UserID)
        {

            string query = "SELECT Album.AlbumID, Album.Title,Album.AlbumCoverArtFileName from album,users,artists where album.ArtistID=artists.ArtistID AND artists.userID = users.UserID AND users.UserID = @UserID";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {

                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCon.Open();
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

        [HttpPost]
        [Route("AddPlaylist")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> AddPlaylist(int UserID, string Title, string description, IFormFile PlaylistPicture)
        {
            try
            {
                BlobContainerClient blobcontainer = blobServiceClient.GetBlobContainerClient("playlistimagecontainer");

                string uniqueID = Guid.NewGuid().ToString();
                string uniquePhoto = $"uploads/" + uniqueID + ".png";
                BlobClient blobclient = blobcontainer.GetBlobClient(uniquePhoto);

                using (var stream = PlaylistPicture.OpenReadStream())
                {
                    await blobclient.UploadAsync(stream, true);
                }
                string playlistpictureurl = "https://blobcontainer2005.blob.core.windows.net/playlistimagecontainer/uploads/" + uniqueID + ".png";


                string query = "insert into dbo.playlist(UserID, Title, PlaylistDescription,PlaylistPicture) VALUES(@UserID, @Title, @description, @playlistpictureurl)";
                DataTable table = new DataTable();
                string sqldatasource = _configuration.GetConnectionString("DatabaseConnection");
                using (SqlConnection con = new SqlConnection(sqldatasource))
                {
                    con.Open();
                    using (SqlCommand command = new SqlCommand(query, con))
                    {
                        command.Parameters.AddWithValue("@UserID", UserID);
                        command.Parameters.AddWithValue("@Title", Title);
                        command.Parameters.AddWithValue("@description", description);
                        command.Parameters.AddWithValue("@playlistpictureurl", playlistpictureurl);
                        SqlDataReader myReader = command.ExecuteReader();
                        table.Load(myReader);
                        myReader.Close();
                        con.Close();
                    }
                }
                return new JsonResult(playlistpictureurl);
            }
            catch (Exception ex)
            {
                return new JsonResult($"Upload Failed: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("AddSongPlaylist")]
        public JsonResult AddSongPlaylist(int SongID, int PlaylistID)
        {
            string checkQuery = "SELECT COUNT(*) FROM PLAYLISTSONGS WHERE SongID = @SongID AND PlaylistID = @PlaylistID";
            string query = "insert into dbo.PLAYLISTSONGS(SongID, PlaylistID) VALUES (@SongID, @PlaylistID)";
            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand checkCommand = new SqlCommand(checkQuery, myCon))
                {
                    checkCommand.Parameters.AddWithValue("@SongID", SongID);
                    checkCommand.Parameters.AddWithValue("@PlaylistID", PlaylistID);

                    int count = (int)checkCommand.ExecuteScalar();

                    if (count > 0)
                    {
                        return new JsonResult(new { success = false, message = "This song is already in the playlist." });
                    }
                }
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@SongID", SongID);
                    myCommand.Parameters.AddWithValue("@PlaylistID", PlaylistID);
                    SqlDataReader myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            string message = PlaylistID + " has " + SongID;

            return new JsonResult(message);

        }

        [HttpPost]
        [Route("ReportSongs")]
        public JsonResult ReportSong(int SongID, int UserID, string Reason)
        {
            string checkQuery = "SELECT COUNT(*) FROM reportedlogs WHERE SongID = @SongID AND ReportedBy = @UserID";
            string query = "insert into reportedlogs(SongID,ReportedBy,Reason,ReportStatus, CreatedAt,AdminID) values (@SongID, @ReportedBy,@Reason,1, @CreatedAt, 1); UPDATE Songs SET isReported = 1  WHERE SongID = @SongID;";

            DataTable table = new DataTable();
            string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

            using (SqlConnection myCon = new SqlConnection(sqlDatasource))
            {
                myCon.Open();
                using (SqlCommand checkCommand = new SqlCommand(checkQuery, myCon))
                {
                    checkCommand.Parameters.AddWithValue("@SongID", SongID);
                    checkCommand.Parameters.AddWithValue("@UserID", UserID);

                    int existingReports = (int)checkCommand.ExecuteScalar();
                    if (existingReports > 0)
                    {
                        return new JsonResult($"User {UserID} has already reported Song {SongID}.");
                    }
                }
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@SongID", SongID);
                    myCommand.Parameters.AddWithValue("@ReportedBy", UserID);
                    myCommand.Parameters.AddWithValue("@Reason", Reason);
                    myCommand.Parameters.AddWithValue("CreatedAt", DateTime.Now);
                    SqlDataReader myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }

            }
            string message = SongID + " has been reported by " + UserID + " for this reason : " + Reason;
            return new JsonResult(message);
        }


        [HttpGet]
        [Route("GetPlaylistSongs")]
        public JsonResult GetPlaylistSongs(int PlaylistID)
        {


            string query = "SELECT SONGS.GenreCode,SONGS.SongFileName,SONGS.SongName,SONGS.ReleaseDate,SONGS.CoverArtFileName,SONGS.Duration,SONGS.TotalRatings FROM PLAYLIST,SONGS, PLAYLISTSONGS WHERE PLAYLISTSONGS.SongID=SONGS.SongID AND  SONGS.IsDeleted = 0 AND PLAYLISTSONGS.PlaylistID=PLAYLIST.PlaylistID AND PLAYLISTSONGS.PlaylistID=@PlaylistID";
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