using SalesOrderPortal.Application.Interfaces;
using SalesOrderPortal.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesOrderPortal.Application.Services
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;

        public ItemService(IItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

        public async Task<IEnumerable<Item>> GetItemsAsync()
        {
            return await _itemRepository.GetAllAsync();
        }
    }
}