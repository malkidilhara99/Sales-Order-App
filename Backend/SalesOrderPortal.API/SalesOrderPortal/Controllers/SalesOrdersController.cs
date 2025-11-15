using Microsoft.AspNetCore.Mvc;
using SalesOrderPortal.Application.DTOs; // For our DTO
using SalesOrderPortal.Application.Interfaces; // For the service
using System.Threading.Tasks;

namespace SalesOrderPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // This makes the URL "/api/salesorders"
    public class SalesOrdersController : ControllerBase
    {
        private readonly ISalesOrderService _salesOrderService;

        // Inject the service
        public SalesOrdersController(ISalesOrderService salesOrderService)
        {
            _salesOrderService = salesOrderService;
        }

        // POST: api/salesorders
        [HttpPost]
        public async Task<IActionResult> CreateSalesOrder([FromBody] SalesOrderCreateDto salesOrderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _salesOrderService.CreateSalesOrderAsync(salesOrderDto);
                return StatusCode(201); // "Created"
            }
            catch (System.Exception ex)
            {
                // Return a 500 internal server error with the message
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // This is the new endpoint for the Home Screen
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalesOrderListDto>>> GetAllSalesOrders()
        {
            var orders = await _salesOrderService.GetAllSalesOrdersAsync();
            return Ok(orders);
        }

        // GET: api/salesorders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SalesOrderDetailDto>> GetSalesOrder(int id)
        {
            var order = await _salesOrderService.GetSalesOrderByIdAsync(id);

            if (order == null)
            {
                return NotFound();
            }

            return Ok(order);
        }

        // PUT: api/salesorders/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSalesOrder(int id, [FromBody] SalesOrderCreateDto salesOrderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _salesOrderService.UpdateSalesOrderAsync(id, salesOrderDto);
                return NoContent(); // "204 No Content" is a standard success response for a PUT
            }
            catch (System.Exception ex)
            {
                // Return a 500 internal server error with the message
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}