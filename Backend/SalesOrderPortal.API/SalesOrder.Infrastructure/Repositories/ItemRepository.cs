using Microsoft.EntityFrameworkCore;
using SalesOrderPortal.Application.Interfaces;
using SalesOrderPortal.Domain.Entities;
using SalesOrderPortal.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesOrderPortal.Infrastructure.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly SalesOrderContext _context;

        public ItemRepository(SalesOrderContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Item>> GetAllAsync()
        {
            return await _context.Items.ToListAsync();
        }
    }
}