using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MusicLibraryBackend.Models;
using System;
using System.Data;

namespace MusicLibraryBackend.Services
{
    public class DeleteService
    {

        private readonly IConfiguration _configuration;

        public DeleteService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public JsonResult DeleteWithName(string Table, string Column,string Name)
        {
            try
            {
                // Validate table/column names (do this for security!)
                string query = $"DELETE FROM {Table} WHERE {Column}=@Name" ;

                string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    using (SqlCommand cmd = new SqlCommand(query, myCon))
                    {
                        cmd.Parameters.AddWithValue("@Name", Name);

                        myCon.Open();
                        int rowsAffected = cmd.ExecuteNonQuery(); // use this instead of reader
                        myCon.Close();

                        string message = $"Successfully Deleted {rowsAffected} row(s) where {Column} = {Name}";
                        return new JsonResult(message);
                    }
                }
            }
            catch (Exception ex)
            {
                return new JsonResult($"Delete Update: {ex.Message}");
            }

        }

        public JsonResult DeleteWithID(string Table, string Column, int ID)
        {
            try
            {
                // Validate table/column names (do this for security!)
                string query = $"DELETE FROM {Table} WHERE {Column}=@ID";

                string sqlDatasource = _configuration.GetConnectionString("DatabaseConnection");

                using (SqlConnection myCon = new SqlConnection(sqlDatasource))
                {
                    using (SqlCommand cmd = new SqlCommand(query, myCon))
                    {
                        cmd.Parameters.AddWithValue("@ID", ID);

                        myCon.Open();
                        int rowsAffected = cmd.ExecuteNonQuery(); // use this instead of reader
                        myCon.Close();

                        string message = $"Successfully Deleted {rowsAffected} row(s) where {Column} = {ID}";
                        return new JsonResult(message);
                    }
                }
            }
            catch (Exception ex)
            {
                return new JsonResult($"Delete Update: {ex.Message}");
            }

        }
    }
}
