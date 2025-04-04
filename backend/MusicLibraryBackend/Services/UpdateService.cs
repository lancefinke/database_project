using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MusicLibraryBackend.Models;
using System.Data;


namespace MusicLibraryBackend.Services
{
    public class UpdateService
    {

        private readonly IConfiguration _configuration;
        public UpdateService(IConfiguration configuration)
        {
            _configuration = configuration;
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

    }
}
