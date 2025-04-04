using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MusicLibraryBackend.Models;
using MusicLibraryBackend.Services;

using System.Data;

namespace MusicLibraryBackend.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UpdateController : ControllerBase
    {
        private readonly UpdateService _updateService;

        public UpdateController(UpdateService updateService)
        {
            _updateService = updateService;
        }

        [HttpPatch]
        [Route("UpdateText")]
        public JsonResult UpdateText([FromQuery] string Table, string Column, string NewValue,string TableKey, int ID)
        {
            var result = _updateService.UpdateText(Table, Column, NewValue,TableKey, ID);
            return new JsonResult(result);

        }

        [HttpPatch]
        [Route("UpdateNumber")]
        public JsonResult UpdateInt([FromQuery] string Table, string Column, int NewValue, string TableKey, int ID)
        {
            var result = _updateService.UpdateInt(Table, Column, NewValue, TableKey, ID);
            return new JsonResult(result);

        }

        [HttpPatch]
        [Route("UpdateBoolean")]
        public JsonResult UpdateBoolean([FromQuery] string Table, string Column, bool NewValue, string TableKey, int ID)
        {
            var result = _updateService.UpdateBoolean(Table, Column, NewValue, TableKey, ID);
            return new JsonResult(result);

        }
    }
}
