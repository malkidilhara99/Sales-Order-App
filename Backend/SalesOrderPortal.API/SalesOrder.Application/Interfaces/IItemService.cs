using SalesOrderPortal.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesOrderPortal.Application.Interfaces
{
    public interface IItemService
    {
        Task<IEnumerable<Item>> GetItemsAsync();
    }
}