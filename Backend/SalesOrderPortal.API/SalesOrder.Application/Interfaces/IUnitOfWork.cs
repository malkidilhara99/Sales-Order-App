using System.Threading.Tasks;

namespace SalesOrderPortal.Application.Interfaces
{
    public interface IUnitOfWork
    {
        Task<int> SaveChangesAsync();
    }
}