using Microsoft.AspNetCore.Mvc;
using SalesOrderPortal.Application.Interfaces; 
using SalesOrderPortal.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesOrderPortal.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientsController : ControllerBase
    {
        // 1. Add a private field for the service
        private readonly IClientService _clientService;

        // 2. Inject the service in the constructor
        public ClientsController(IClientService clientService)
        {
            _clientService = clientService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetClients()
        {
            // 3. Call the service to get real data
            var clients = await _clientService.GetClientsAsync();
            return Ok(clients);
        }
    }
}