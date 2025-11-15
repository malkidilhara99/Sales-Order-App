using SalesOrderPortal.Domain.Entities;

namespace SalesOrderPortal.Application.Interfaces
{
    public interface IClientService
    {
        Task<IEnumerable<Client>> GetClientsAsync();
    }
}