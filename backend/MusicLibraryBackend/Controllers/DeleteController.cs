using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MusicLibraryBackend.Models;
using MusicLibraryBackend.Services;

using System.Data;

namespace MusicLibraryBackend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class DeleteController : ControllerBase
    {

        private readonly DeleteService _deleteService;

        public DeleteController(DeleteService deleteService)
        {
            _deleteService = deleteService;
        }

        [HttpDelete]
        [Route("DeleteByName")]
        public JsonResult DeleteWithName([FromQuery] string Table, string Column, string Name)
        {
            var result = _deleteService.DeleteWithName(Table, Column, Name);
            return new JsonResult(result);

        }

        [HttpDelete]
        [Route("DeleteByID")]
        public JsonResult DeleteWithID([FromQuery] string Table, string Column, int ID)
        {
            var result = _deleteService.DeleteWithID(Table, Column, ID);
            return new JsonResult(result);

        }
    }
}
