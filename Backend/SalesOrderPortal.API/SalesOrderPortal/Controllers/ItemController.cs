using Microsoft.AspNetCore.Mvc;
using SalesOrderPortal.Application.Interfaces;
using SalesOrderPortal.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesOrderPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // This makes the URL "/api/items"
    public class ItemsController : ControllerBase
    {
        private readonly IItemService _itemService;

        public ItemsController(IItemService itemService)
        {
            _itemService = itemService;
        }

        [HttpGet] // This creates an HTTP GET endpoint
        public async Task<ActionResult<IEnumerable<Item>>> GetItems()
        {
            var items = await _itemService.GetItemsAsync();
            return Ok(items);
        }
    }
}