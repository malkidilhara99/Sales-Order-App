using SalesOrderPortal.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesOrderPortal.Application.Interfaces
{
    public interface ISalesOrderService
    {
        Task CreateSalesOrderAsync(SalesOrderCreateDto salesOrderDto);
        Task<IEnumerable<SalesOrderListDto>> GetAllSalesOrdersAsync();
        Task<SalesOrderDetailDto> GetSalesOrderByIdAsync(int id);

        
        Task UpdateSalesOrderAsync(int id, SalesOrderCreateDto salesOrderDto);
    }
}