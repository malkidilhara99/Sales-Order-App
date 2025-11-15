using SalesOrderPortal.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesOrderPortal.Application.Interfaces
{
    public interface ISalesOrderRepository
    {
        Task AddAsync(SalesOrder salesOrder);
        Task<IEnumerable<SalesOrder>> GetAllAsync();
        Task<SalesOrder> GetByIdAsync(int id);

        // VVV THIS IS THE NEW LINE YOU NEED TO ADD VVV
        void RemoveSalesOrderItems(IEnumerable<SalesOrderItem> items);
    }
}