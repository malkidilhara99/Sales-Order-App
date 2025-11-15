using Microsoft.EntityFrameworkCore;
using SalesOrderPortal.Domain.Entities;

namespace SalesOrderPortal.Infrastructure.Data
{
    // NO parentheses on this line
    public class SalesOrderContext : DbContext
    {
        // THIS IS THE CLASSIC CONSTRUCTOR THE TOOL IS LOOKING FOR
        public SalesOrderContext(DbContextOptions<SalesOrderContext> options) : base(options)
        {
        }

        // These DbSets tell EF Core which classes to turn into database tables
        public DbSet<Client> Clients { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<SalesOrder> SalesOrders { get; set; } // <-- I also fixed a typo here
        public DbSet<SalesOrderItem> SalesOrderItems { get; set; }
    }
}