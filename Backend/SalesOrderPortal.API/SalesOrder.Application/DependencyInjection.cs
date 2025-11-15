using Microsoft.Extensions.DependencyInjection;
using SalesOrderPortal.Application.Interfaces;
using SalesOrderPortal.Application.Services;

namespace SalesOrderPortal.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection ADDApplicationDI(this IServiceCollection services)
        {
            services.AddScoped<IClientService, ClientService>();

         
            services.AddScoped<IItemService, ItemService>();
            services.AddScoped<ISalesOrderService, SalesOrderService>();

            return services;
        }
    }
}