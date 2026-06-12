using Microsoft.AspNetCore.Mvc;
using PurchaseAPI.Services;


namespace PurchaseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseController : ControllerBase
    {
        private readonly PurchaseService _purchaseService;

        public PurchaseController(PurchaseService purchaseService)
        {
            _purchaseService = purchaseService;
        }

        [HttpGet("test-connection")]
        public IActionResult TestConnection()
        {
            bool isConnected = _purchaseService.TestConnection();
            if (isConnected)
            {
                return Ok(new { message =   

                    "Database connection successful." }
                );
            }
            else
            {
                return StatusCode(500, new { message = "Failed to connect to the database." }
                );
            }
        }

        [HttpGet("next-inward-no")]
        public IActionResult GetNextInwardNo()
        {
            try
            {
                int nextInwardNo = _purchaseService.GetNextInwardNo();
                return Ok(new { nextInwardNo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occurred while fetching next inward number." });
            }
        }
    }
}