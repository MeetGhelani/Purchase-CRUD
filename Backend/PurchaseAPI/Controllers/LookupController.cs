using Microsoft.AspNetCore.Mvc;
using PurchaseAPI.Services;

namespace PurchaseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]

    public class LookupController : ControllerBase
    {
        private readonly LookupService _lookupService;

        public LookupController(LookupService lookupService)
        {
            _lookupService = lookupService;
        }

        [HttpGet("{tableName}")]
        public IActionResult GetLookupData(string tableName)
        {
            try
            {
                var result = _lookupService.GetLookupData(tableName);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving lookup data: {ex.Message}");
            }
        }

        [HttpPost("search")]
        public IActionResult SearchLookup([FromBody]LookupSearchDTO search)
        {
            return Ok(
                _lookupService
                    .SearchLookup(search));
        }


    }
}