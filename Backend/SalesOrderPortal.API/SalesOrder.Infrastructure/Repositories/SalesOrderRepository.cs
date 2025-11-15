using Microsoft.EntityFrameworkCore;
using SalesOrderPortal.Application.Interfaces;
using SalesOrderPortal.Domain.Entities;
using SalesOrderPortal.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesOrderPortal.Infrastructure.Repositories
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private readonly SalesOrderContext _context;

        public SalesOrderRepository(SalesOrderContext context)
        {
            _context = context;
        }

        public async Task AddAsync(SalesOrder salesOrder)
        {
            await _context.SalesOrders.AddAsync(salesOrder);
            // We save changes in the Unit of Work
        }

        public async Task<IEnumerable<SalesOrder>> GetAllAsync()
        {
            // We must .Include() the Client to get the CustomerName
            return await _context.SalesOrders
                .Include(so => so.Client)
                .ToListAsync();
        }

        public async Task<SalesOrder> GetByIdAsync(int id)
        {
            // We must include OrderItems, and THEN include the Item for each OrderItem
            return await _context.SalesOrders
                .Include(so => so.OrderItems)
                    .ThenInclude(oi => oi.Item)
                .FirstOrDefaultAsync(so => so.Id == id);
        }

       
        public void RemoveSalesOrderItems(IEnumerable<SalesOrderItem> items)
        {
            _context.SalesOrderItems.RemoveRange(items);
        }
    }
}