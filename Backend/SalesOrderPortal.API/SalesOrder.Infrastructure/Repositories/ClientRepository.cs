using Microsoft.EntityFrameworkCore;
using SalesOrderPortal.Application.Interfaces;
using SalesOrderPortal.Domain.Entities;
using SalesOrderPortal.Infrastructure.Data;

namespace SalesOrderPortal.Infrastructure.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly SalesOrderContext _context;

        public ClientRepository(SalesOrderContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Client>> GetAllAsync()
        {
            return await _context.Clients.ToListAsync();
        }
    }
}