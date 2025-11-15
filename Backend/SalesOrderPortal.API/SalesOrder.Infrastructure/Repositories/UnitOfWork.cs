using SalesOrderPortal.Application.Interfaces;
using SalesOrderPortal.Infrastructure.Data;
using System.Threading.Tasks;

namespace SalesOrderPortal.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly SalesOrderContext _context;

        public UnitOfWork(SalesOrderContext context)
        {
            _context = context;
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}