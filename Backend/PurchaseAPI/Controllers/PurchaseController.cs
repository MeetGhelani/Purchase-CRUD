using Microsoft.AspNetCore.Mvc;
using PurchaseAPI.Services;
using PurchaseAPI.DTOs;
using PurchaseAPI.Models;


namespace PurchaseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class purchaseController : ControllerBase
    {
        private readonly PurchaseService _purchaseService;

        public purchaseController(PurchaseService purchaseService)
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
                return Ok(new { NextInwardNo = nextInwardNo });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error occurred while fetching next inward number." });
            }
        }

        [HttpPost("save-purchase")]
        public IActionResult SavePurchase([FromBody] PurchaseSaveDTO purchase)
        {
            var result = _purchaseService.SavePurchase(purchase);
            if (result.Success)
            {
                return Ok(result);
            }
            else
            {
                return BadRequest(result);
            }
        }

        [HttpGet("get-by-inwardno/{inwardNo}")]
        public IActionResult GetPurchase(int inwardNo)
        {
            var result = _purchaseService.GetPurchaseByInwardNo(inwardNo);
            if (result != null)
            {
                return Ok(result);
            }
            else
            {
                return NotFound(new { message = $"Purchase with InwardNo {inwardNo} not found." });
            }
        }

       [HttpPut("update-purchase")]
        public IActionResult UpdatePurchase(
            PurchaseSaveDTO purchase)
        {
            var result =
                _purchaseService
                    .UpdatePurchase(purchase);

            return Ok(result);
        }

    }
}