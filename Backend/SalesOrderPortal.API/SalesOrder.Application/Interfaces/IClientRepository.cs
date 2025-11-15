using SalesOrderPortal.Domain.Entities;

namespace SalesOrderPortal.Application.Interfaces
{
    public interface IClientRepository
    {
        Task<IEnumerable<Client>> GetAllAsync();
    }
}