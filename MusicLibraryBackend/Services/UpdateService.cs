using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MusicLibraryBackend.Models;
using System.Data;

using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace MusicLibraryBackend.Services
{
    public class UpdateService
    {

        private readonly IConfiguration _configuration;
        private BlobServiceClient blobServiceClient;

        public UpdateService(IConfiguration configuration)
        {
            _configuration = configuration;

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

        public JsonResult UpdateText(string Table,string Column,string NewValue,string TableKey, int ID)
        {
            try
            {
                // Validate table/column names (do this for security!)
                string query = $"UPDATE {Table} SET {Column} = @NewValue WHERE {TableKey} = @ID";

                string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    using (SqlCommand cmd = new SqlCommand(query, myCon))
                    {
                        cmd.Parameters.AddWithValue("@NewValue", NewValue);
                        cmd.Parameters.AddWithValue("@ID", ID);

                        myCon.Open();
                        int rowsAffected = cmd.ExecuteNonQuery(); // use this instead of reader
                        myCon.Close();

                        string message = $"Successfully Updated {rowsAffected} row(s)";
                        return new JsonResult(message);
                    }
                }
            }
            catch (Exception ex)
            {
                return new JsonResult($"Upload Update: {ex.Message}");
            }

        }

        public JsonResult UpdateInt(string Table, string Column, int NewValue, string TableKey, int ID)
        {
            try
            {
                // Validate table/column names (do this for security!)
                string query = $"UPDATE {Table} SET {Column} = @NewValue WHERE {TableKey} = @ID";

                string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    using (SqlCommand cmd = new SqlCommand(query, myCon))
                    {
                        cmd.Parameters.AddWithValue("@NewValue", NewValue);
                        cmd.Parameters.AddWithValue("@ID", ID);

                        myCon.Open();
                        int rowsAffected = cmd.ExecuteNonQuery(); // use this instead of reader
                        myCon.Close();

                        string message = $"Successfully Updated {rowsAffected} row(s)";
                        return new JsonResult(message);
                    }
                }
            }
            catch (Exception ex)
            {
                return new JsonResult($"Upload Failed: {ex.Message}");
            }

        }

        public JsonResult UpdateBoolean(string Table, string Column, bool NewValue, string TableKey, int ID)
        {
            try
            {
                // Validate table/column names (do this for security!)
                string query = $"UPDATE {Table} SET {Column} = @NewValue WHERE {TableKey} = @ID";

                string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    using (SqlCommand cmd = new SqlCommand(query, myCon))
                    {
                        cmd.Parameters.AddWithValue("@NewValue", NewValue);
                        cmd.Parameters.AddWithValue("@ID", ID);

                        myCon.Open();
                        int rowsAffected = cmd.ExecuteNonQuery(); // use this instead of reader
                        myCon.Close();

                        string message = $"Successfully Updated {rowsAffected} row(s)";
                        return new JsonResult(message);
                    }
                }
            }
            catch (Exception ex)
            {
                return new JsonResult($"Upload Failed: {ex.Message}");
            }

        }

        public async Task<IActionResult> UpdateFile(string container, string Table, string Column, IFormFile NewFile, string TableKey, int ID,string filetype)
        {
            try
            {
                BlobContainerClient blobcontainer = blobServiceClient.GetBlobContainerClient(container);

                string uniqueID = Guid.NewGuid().ToString();
                string uniqueFile = $"uploads/" + uniqueID + "."+filetype;
                BlobClient blobclient = blobcontainer.GetBlobClient(uniqueFile);

                using (var stream = NewFile.OpenReadStream())
                {
                    await blobclient.UploadAsync(stream, true);
                }
                string NewUrl = "https://blobcontainer2005.blob.core.windows.net/"+container+"/uploads/" + uniqueID + "."+filetype;

                // Validate table/column names (do this for security!)
                string query = $"UPDATE {Table} SET {Column} = @NewFile WHERE {TableKey} = @ID";

                string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    using (SqlCommand cmd = new SqlCommand(query, myCon))
                    {
                        cmd.Parameters.AddWithValue("@NewFile", NewUrl);
                        cmd.Parameters.AddWithValue("@ID", ID);

                        myCon.Open();
                        int rowsAffected = cmd.ExecuteNonQuery(); // use this instead of reader
                        myCon.Close();

                        string message = $"Successfully Updated {rowsAffected} row(s)";
                        return new JsonResult(message);
                    }
                }
            }
            catch (Exception ex)
            {
                return new JsonResult($"Upload Failed: {ex.Message}");
            }

        }

    }
}
