using SalesOrderPortal.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesOrderPortal.Application.Interfaces
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> GetAllAsync();
    }
}