using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SalesOrderPortal.Application.Interfaces;
using SalesOrderPortal.Infrastructure.Data;
using SalesOrderPortal.Infrastructure.Repositories;

namespace SalesOrderPortal.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection ADDInfrastructureDI(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                                     ?? throw new InvalidOperationException("DefaultConnection not found.");

            services.AddDbContext<SalesOrderContext>(options =>
                options.UseSqlServer(connectionString));

            services.AddScoped<IClientRepository, ClientRepository>();
            services.AddScoped<IItemRepository, ItemRepository>();

            
            services.AddScoped<ISalesOrderRepository, SalesOrderRepository>();

           
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}